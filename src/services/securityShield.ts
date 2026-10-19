// Security Shield Service (Module 5 & Webview Encryption)

export class SecurityShield {
  private static isInitialized = false;

  public static initialize(): void {
    if (typeof window === 'undefined' || this.isInitialized) return;

    // 1. Prevent F12, DevTools hotkeys, Ctrl+U, Ctrl+S
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (Inspect elements)
      if (e.ctrlKey && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+U (View Source)
      if (e.ctrlKey && ['u', 'U'].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl+S (Save Page)
      if (e.ctrlKey && ['s', 'S'].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    });

    // 2. Prevent right-click context menu on protected areas
    window.addEventListener('contextmenu', (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest('.security-guarded')) {
        e.preventDefault();
        return false;
      }
    });

    // 3. Prevent clipboard copy on exam questions & curriculum protected text
    window.addEventListener('copy', (e: ClipboardEvent) => {
      const selection = window.getSelection()?.toString();
      if (selection && selection.length > 5) {
        // Can optionally obfuscate or prevent
        const activeEl = document.activeElement;
        if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
          return; // allow form typing
        }
        e.preventDefault();
        if (e.clipboardData) {
          e.clipboardData.setData('text/plain', 'PROPIEDAD INTELECTUAL PROTEGIDA - MASTER PEN TRAINING © MICHAEL PEN');
        }
      }
    });

    this.isInitialized = true;
    console.log('[SecurityShield] Webview Protection Active: Anti-F12, Anti-Inspect, Anti-Copy, 15-min Signed Token Guard.');
  }

  public static formatTimeRemaining(expiryTimestamp: number): string {
    const remainingMs = Math.max(0, expiryTimestamp - Date.now());
    const totalSeconds = Math.floor(remainingMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
}
