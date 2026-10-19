// Assessment Schema V1 Definitions
// Compliant with ASSESSMENT_SCHEMA_v1 specification for Master Pen Training courses

export type ModuleState = 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'ASSESSMENT_PENDING' | 'PASSED';

export interface AssessmentOption {
  option_id: string;
  option_text: string;
}

export interface AssessmentItemInternal {
  item_id: string;
  group: string; // e.g. G1_DISPARADORES, G2_FRICCION_CERO, etc.
  stem: string;
  options: AssessmentOption[];
  // Server-only fields
  correct_option_id: string;
  explanation_internal: string;
  review_pointer: string;
}

export interface ClientAssessmentOption {
  label: 'A' | 'B' | 'C' | 'D';
  option_id: string;
  option_text: string;
}

export interface ClientAssessmentItem {
  item_id: string;
  group: string;
  stem: string;
  options: ClientAssessmentOption[];
  review_pointer?: string;
}

export interface AssessmentAttemptRecord {
  attempt_number: number;
  timestamp: number;
  score: number; // e.g. 0.9 = 90%
  points: number;
  total_items: number;
  passed: boolean;
  result_summary: string;
  review_pointers: string[];
  user_answers: Record<string, string>; // item_id -> option_id
}

export interface AssessmentSchemaConfig {
  schema_version: 'ASSESSMENT_SCHEMA_v1';
  module_id: string;
  course_id: string;
  course_title: string;
  instructor_name: string;
  bank_size: number;
  items_per_attempt: number;
  sampling: {
    method: 'stratified_without_replacement';
    rule: string;
  };
  scoring: {
    points_per_item: number;
    pass_threshold: number; // 0.8
  };
  attempts: {
    max_before_cooldown: number; // 3
    cooldown_hours: number; // 24
    require_review_before_retry: boolean; // true
  };
  state_machine: {
    module_states: ModuleState[];
    transitions: Array<{
      from: ModuleState;
      to: ModuleState;
      on: string;
      side_effect?: string;
    }>;
  };
  server_only_fields: string[];
  client_visible_fields: string[];
}

export interface ActiveV1Session {
  session_id: string;
  module_id: string;
  session_seed: string;
  started_at: number;
  client_items: ClientAssessmentItem[];
  // Kept in memory / secure state
  permutation_log: Record<string, {
    original_item_id: string;
    correct_option_id: string;
    label_map: Record<string, 'A' | 'B' | 'C' | 'D'>;
  }>;
}

export interface ModuleProgressState {
  module_id: string;
  state: ModuleState;
  completed_slides: string[];
  attempts: AssessmentAttemptRecord[];
  cooldown_until?: number;
  requires_review: boolean;
  last_result_summary?: string;
  last_review_pointers?: string[];
  passed_at?: string;
}
