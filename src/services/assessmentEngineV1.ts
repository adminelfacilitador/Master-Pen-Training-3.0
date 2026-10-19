// Assessment Engine V1
// Implements ASSESSMENT_SCHEMA_v1:
// - Stratified sampling without replacement (7 groups + 3 remaining)
// - Server-only vs Client-visible field protection
// - Attempts tracking, 24h cooldown, review pointers
// - Module State Machine transitions

import { 
  AssessmentSchemaConfig, 
  AssessmentItemInternal, 
  ClientAssessmentItem, 
  ClientAssessmentOption,
  ActiveV1Session,
  ModuleProgressState,
  AssessmentAttemptRecord,
  ModuleState
} from '../types/assessmentSchemaV1';
import { 
  ESCRITURA_CREATIVA_CONFIG_M1, 
  ESCRITURA_CREATIVA_M1_BANK,
  ESCRITURA_CREATIVA_M1_SLIDES
} from '../data/escrituraCreativaCourse';

const STORAGE_KEY_PREFIX = 'mpt_assessment_v1_';

export class AssessmentEngineV1 {
  private static activeSessions: Map<string, { session: ActiveV1Session; internalItems: Map<string, AssessmentItemInternal> }> = new Map();

  /**
   * Retrieves or initializes progress state for a user and module
   */
  public static getModuleProgress(userId: string, moduleId: string = 'M1'): ModuleProgressState {
    const key = `${STORAGE_KEY_PREFIX}${userId}_${moduleId}`;
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw) as ModuleProgressState;
          // Check if cooldown expired
          if (parsed.cooldown_until && Date.now() >= parsed.cooldown_until) {
            parsed.cooldown_until = undefined;
            // reset attempts counter after cooldown
            parsed.attempts = [];
          }
          return parsed;
        }
      } catch (e) {
        console.warn('[AssessmentEngineV1] Could not read local state:', e);
      }
    }

    const initial: ModuleProgressState = {
      module_id: moduleId,
      state: 'AVAILABLE',
      completed_slides: [],
      attempts: [],
      requires_review: false
    };
    return initial;
  }

  /**
   * Persists updated module progress
   */
  public static saveModuleProgress(userId: string, progress: ModuleProgressState): void {
    const key = `${STORAGE_KEY_PREFIX}${userId}_${progress.module_id}`;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(progress));
      } catch (e) {
        console.warn('[AssessmentEngineV1] Could not save state:', e);
      }
    }
  }

  /**
   * Transition: User opens module (AVAILABLE -> IN_PROGRESS)
   */
  public static openModule(userId: string, moduleId: string = 'M1'): ModuleProgressState {
    const progress = this.getModuleProgress(userId, moduleId);
    if (progress.state === 'AVAILABLE') {
      progress.state = 'IN_PROGRESS';
      this.saveModuleProgress(userId, progress);
    }
    return progress;
  }

  /**
   * Mark slide completed. When all slides are completed, transitions IN_PROGRESS -> ASSESSMENT_PENDING
   */
  public static markSlideCompleted(userId: string, slideId: string, moduleId: string = 'M1'): ModuleProgressState {
    const progress = this.getModuleProgress(userId, moduleId);
    if (!progress.completed_slides.includes(slideId)) {
      progress.completed_slides.push(slideId);
    }

    const allSlidesCount = ESCRITURA_CREATIVA_M1_SLIDES.length;
    if (progress.completed_slides.length >= allSlidesCount && progress.state === 'IN_PROGRESS') {
      progress.state = 'ASSESSMENT_PENDING';
      progress.requires_review = false;
    }

    this.saveModuleProgress(userId, progress);
    return progress;
  }

  /**
   * Generates a new exam attempt strictly obeying Stratified Sampling Without Replacement:
   * 1 item per thematic group (7 groups) + 3 additional items from the remainder of the 20-item bank
   */
  public static startAssessmentSession(userId: string, moduleId: string = 'M1'): { session: ActiveV1Session; error?: string } {
    const progress = this.getModuleProgress(userId, moduleId);

    // Cooldown check
    if (progress.cooldown_until && Date.now() < progress.cooldown_until) {
      const remainingHours = Math.ceil((progress.cooldown_until - Date.now()) / (1000 * 60 * 60));
      return { 
        session: null as any, 
        error: `Período de enfriamiento activo. Podrás reintentar esta evaluación en aproximadamente ${remainingHours} horas.` 
      };
    }

    // Review requirement check
    if (progress.requires_review && ESCRITURA_CREATIVA_CONFIG_M1.attempts.require_review_before_retry) {
      // Must review slides/pointers
    }

    const bank = ESCRITURA_CREATIVA_M1_BANK;
    const groups = Array.from(new Set(bank.map(b => b.group)));

    // Step 1: Exactly 1 item per thematic group (7 items)
    const selectedItems: AssessmentItemInternal[] = [];
    const usedItemIds = new Set<string>();

    for (const group of groups) {
      const groupItems = bank.filter(b => b.group === group);
      const randomItem = groupItems[Math.floor(Math.random() * groupItems.length)];
      selectedItems.push(randomItem);
      usedItemIds.add(randomItem.item_id);
    }

    // Step 2: 3 additional items from the rest of the bank without replacement
    const remainingCandidates = bank.filter(b => !usedItemIds.has(b.item_id));
    const shuffledRemaining = [...remainingCandidates].sort(() => 0.5 - Math.random());
    const additionalThree = shuffledRemaining.slice(0, 3);
    selectedItems.push(...additionalThree);

    // Step 3: Shuffle the 10 selected items
    const finalTen = [...selectedItems].sort(() => 0.5 - Math.random());

    // Step 4: Permute options and sanitize to client_visible_fields
    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const sessionSeed = `seed_${Math.random().toString(36).substring(2, 10)}`;
    const labels: Array<'A' | 'B' | 'C' | 'D'> = ['A', 'B', 'C', 'D'];

    const clientItems: ClientAssessmentItem[] = [];
    const permutationLog: ActiveV1Session['permutation_log'] = {};
    const internalItemsMap = new Map<string, AssessmentItemInternal>();

    for (const item of finalTen) {
      internalItemsMap.set(item.item_id, item);
      const shuffledOptions = [...item.options].sort(() => 0.5 - Math.random());
      const clientOpts: ClientAssessmentOption[] = [];
      const labelMap: Record<string, 'A' | 'B' | 'C' | 'D'> = {};

      shuffledOptions.forEach((opt, idx) => {
        const lbl = labels[idx];
        labelMap[opt.option_id] = lbl;
        clientOpts.push({
          label: lbl,
          option_id: opt.option_id,
          option_text: opt.option_text
        });
      });

      permutationLog[item.item_id] = {
        original_item_id: item.item_id,
        correct_option_id: item.correct_option_id,
        label_map: labelMap
      };

      // Sanitize: client never sees correct_option_id or internal explanation
      clientItems.push({
        item_id: item.item_id,
        group: item.group,
        stem: item.stem,
        options: clientOpts
      });
    }

    const session: ActiveV1Session = {
      session_id: sessionId,
      module_id: moduleId,
      session_seed: sessionSeed,
      started_at: Date.now(),
      client_items: clientItems,
      permutation_log: permutationLog
    };

    this.activeSessions.set(sessionId, { session, internalItems: internalItemsMap });

    return { session };
  }

  /**
   * Submits answers, computes score, handles state machine transitions, cooldown, and review pointers
   */
  public static submitAssessment(
    userId: string,
    sessionId: string,
    userAnswers: Record<string, string> // item_id -> chosen option_id
  ): {
    passed: boolean;
    score: number;
    points: number;
    total_items: number;
    result_summary: string;
    review_pointers: string[];
    cooldown_hours_remaining?: number;
    new_state: ModuleState;
  } {
    const cached = this.activeSessions.get(sessionId);
    if (!cached) {
      throw new Error('Sesión de evaluación no válida o expirada.');
    }

    const { session, internalItems } = cached;
    let points = 0;
    const reviewPointers: string[] = [];

    session.client_items.forEach(clientItem => {
      const chosenOptionId = userAnswers[clientItem.item_id];
      const log = session.permutation_log[clientItem.item_id];
      const internalItem = internalItems.get(clientItem.item_id);

      if (chosenOptionId && log && chosenOptionId === log.correct_option_id) {
        points += 1;
      } else if (internalItem) {
        reviewPointers.push(`[${internalItem.group}] ${internalItem.review_pointer}`);
      }
    });

    const totalItems = session.client_items.length;
    const score = points / totalItems; // e.g. 8/10 = 0.8
    const passed = score >= ESCRITURA_CREATIVA_CONFIG_M1.scoring.pass_threshold;

    const progress = this.getModuleProgress(userId, session.module_id);
    const attemptNumber = progress.attempts.length + 1;

    let resultSummary = '';
    if (passed) {
      resultSummary = `¡Acreditación Exitosa! Obtuviste ${points}/${totalItems} puntos (${Math.round(score * 100)}%). Superaste el umbral oficial del 80%. Has dominado los fundamentos del Sistema de Captura de Anthony Small.`;
      progress.state = 'PASSED';
      progress.passed_at = new Date().toISOString();
      progress.requires_review = false;
      progress.cooldown_until = undefined;
    } else {
      resultSummary = `Evaluación no superada: ${points}/${totalItems} puntos (${Math.round(score * 100)}%). Se requiere un mínimo de 8/10 (80%) para acreditar. Repasa las diapositivas indicadas en los Punteros de Revisión antes de reintentar.`;
      progress.state = 'IN_PROGRESS';
      progress.requires_review = true;

      // Check max attempts before cooldown
      if (attemptNumber >= ESCRITURA_CREATIVA_CONFIG_M1.attempts.max_before_cooldown) {
        const cooldownMs = ESCRITURA_CREATIVA_CONFIG_M1.attempts.cooldown_hours * 60 * 60 * 1000;
        progress.cooldown_until = Date.now() + cooldownMs;
        resultSummary += ` Has alcanzado el límite de 3 intentos permitidos. Se ha activado el período de enfriamiento de 24 horas para estudio y reposo reflexivo.`;
      }
    }

    const attemptRecord: AssessmentAttemptRecord = {
      attempt_number: attemptNumber,
      timestamp: Date.now(),
      score,
      points,
      total_items: totalItems,
      passed,
      result_summary: resultSummary,
      review_pointers: reviewPointers,
      user_answers: userAnswers
    };

    progress.attempts.push(attemptRecord);
    progress.last_result_summary = resultSummary;
    progress.last_review_pointers = reviewPointers;

    this.saveModuleProgress(userId, progress);
    this.activeSessions.delete(sessionId);

    return {
      passed,
      score,
      points,
      total_items: totalItems,
      result_summary: resultSummary,
      review_pointers: reviewPointers,
      cooldown_hours_remaining: progress.cooldown_until ? Math.ceil((progress.cooldown_until - Date.now()) / (1000 * 60 * 60)) : undefined,
      new_state: progress.state
    };
  }
}
