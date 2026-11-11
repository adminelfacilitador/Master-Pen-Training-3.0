import { useState, useEffect, useRef, useCallback } from 'react';
import { cloudState } from '../services/cloudState';
import { LastReadPosition, UserProfile } from '../types';

export interface UseFocusTrackingOptions {
  isActive: boolean;
  blockId: string;
  blockTitle?: string;
  slideIndex: number;
  slideTitle?: string;
  currentUser?: UserProfile | null;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  autoSaveIntervalMs?: number;
}

export interface UseFocusTrackingReturn {
  sessionDuration: number; // in seconds
  formattedDuration: string; // e.g. "04:25"
  scrollPercentage: number; // 0 to 100
  lastSavedPosition: LastReadPosition | null;
  saveCurrentPosition: (overrideScroll?: number) => void;
  restoreScrollPosition: () => void;
  formatSecondsToTime: (totalSeconds: number) => string;
}

export function useFocusTracking({
  isActive,
  blockId,
  blockTitle,
  slideIndex,
  slideTitle,
  currentUser,
  scrollContainerRef,
  autoSaveIntervalMs = 5000
}: UseFocusTrackingOptions): UseFocusTrackingReturn {
  const [sessionDuration, setSessionDuration] = useState<number>(0);
  const [scrollPercentage, setScrollPercentage] = useState<number>(0);
  const [lastSavedPosition, setLastSavedPosition] = useState<LastReadPosition | null>(() => {
    const uid = currentUser?.uid || 'usr_admin_principal_01';
    return cloudState.getLastReadPosition(uid);
  });

  const durationRef = useRef<number>(0);
  const scrollRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null);

  const getEffectiveUserId = useCallback(() => {
    return currentUser?.uid || cloudState.getCurrentUser()?.uid || 'usr_admin_principal_01';
  }, [currentUser]);

  // Keep references synced
  useEffect(() => {
    durationRef.current = sessionDuration;
  }, [sessionDuration]);

  useEffect(() => {
    scrollRef.current = scrollPercentage;
  }, [scrollPercentage]);

  // Save current reading position to cloudState
  const saveCurrentPosition = useCallback((overrideScroll?: number) => {
    const uid = getEffectiveUserId();
    const finalScroll = typeof overrideScroll === 'number' ? overrideScroll : scrollRef.current;

    const position: LastReadPosition = {
      blockId,
      blockTitle: blockTitle || `Bloque ${blockId.replace('block_', '')}`,
      slideIndex,
      slideTitle: slideTitle || `Diapositiva ${slideIndex + 1}`,
      scrollPercentage: finalScroll,
      timestamp: new Date().toISOString(),
      sessionDurationSeconds: durationRef.current
    };

    cloudState.saveLastReadPosition(uid, position);
    setLastSavedPosition(position);
  }, [blockId, blockTitle, slideIndex, slideTitle, getEffectiveUserId]);

  // Duration tracking interval
  useEffect(() => {
    if (isActive) {
      setSessionDuration(0);
      durationRef.current = 0;

      timerRef.current = setInterval(() => {
        setSessionDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isActive]);

  // Scroll listener for reading container
  useEffect(() => {
    if (!isActive) return;

    const targetEl = scrollContainerRef?.current;

    const handleScroll = () => {
      if (!targetEl) return;
      const { scrollTop, scrollHeight, clientHeight } = targetEl;
      const maxScroll = scrollHeight - clientHeight;
      const pct = maxScroll > 0 ? Math.min(100, Math.max(0, Math.round((scrollTop / maxScroll) * 100))) : 0;
      setScrollPercentage(pct);
    };

    if (targetEl) {
      targetEl.addEventListener('scroll', handleScroll, { passive: true });
      // Initial measurement
      handleScroll();
    }

    return () => {
      if (targetEl) {
        targetEl.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isActive, scrollContainerRef, slideIndex]);

  // Periodic auto-save & save on exit
  useEffect(() => {
    if (!isActive) return;

    autoSaveRef.current = setInterval(() => {
      saveCurrentPosition();
    }, autoSaveIntervalMs);

    return () => {
      if (autoSaveRef.current) {
        clearInterval(autoSaveRef.current);
        autoSaveRef.current = null;
      }
      // Save position when exiting focus mode
      saveCurrentPosition();
    };
  }, [isActive, autoSaveIntervalMs, saveCurrentPosition]);

  // Refresh last saved position whenever cloudState changes
  useEffect(() => {
    const unsub = cloudState.subscribe(() => {
      const uid = getEffectiveUserId();
      setLastSavedPosition(cloudState.getLastReadPosition(uid));
    });
    return () => unsub();
  }, [getEffectiveUserId]);

  // Restore scroll position within the container
  const restoreScrollPosition = useCallback(() => {
    const uid = getEffectiveUserId();
    const saved = cloudState.getLastReadPosition(uid);
    if (!saved || !scrollContainerRef?.current) return;

    const el = scrollContainerRef.current;
    if (saved.blockId === blockId && saved.slideIndex === slideIndex && saved.scrollPercentage > 0) {
      const maxScroll = el.scrollHeight - el.clientHeight;
      if (maxScroll > 0) {
        el.scrollTo({
          top: (saved.scrollPercentage / 100) * maxScroll,
          behavior: 'smooth'
        });
      }
    }
  }, [blockId, slideIndex, scrollContainerRef, getEffectiveUserId]);

  const formatSecondsToTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return {
    sessionDuration,
    formattedDuration: formatSecondsToTime(sessionDuration),
    scrollPercentage,
    lastSavedPosition,
    saveCurrentPosition,
    restoreScrollPosition,
    formatSecondsToTime
  };
}
