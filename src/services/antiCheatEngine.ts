// Anti-Cheat Exam Engine (Module 4)
import { 
  PsychometricQuestion, 
  QuestionOption, 
  OptionLetter, 
  PsychometricRole 
} from '../types';
import { cloudState } from './cloudState';

const LETTERS: OptionLetter[] = ['A', 'B', 'C', 'D'];

export interface ActiveExamSession {
  blockId: string;
  blockNumber: number;
  questions: PsychometricQuestion[];
  assignedLetters: OptionLetter[];
  sessionSeed: string;
  startedAt: number;
}

// Stores the last correct letter assigned for each block index to enforce Anti-Pattern across adjacent blocks
const blockLastCorrectLetters: Record<number, OptionLetter> = {
  1: 'A',
  2: 'C',
  3: 'B'
};

export class AntiCheatEngine {
  /**
   * Generates an active exam for a block obeying:
   * 1. 4 options (A, B, C, D)
   * 2. Strict Psychometric Matrix: 1 correct, 1 similar false, 1 completely false, 1 confusing false
   * 3. Anti-letter pattern: correct letter CANNOT be the same as adjacent block's correct letter
   * 4. 50-variant dynamic rotation: picks different questions on every attempt
   * 5. Passing threshold: at least 4 questions answered correctly in this block
   */
  public static generateExamSession(blockId: string, questionsCount: number = 10): ActiveExamSession {
    const block = cloudState.getBlockById(blockId);
    const blockNumber = block ? block.blockNumber : 1;
    const fullBank = cloudState.getQuestionBank(blockId);

    // Pick previous adjacent block's correct letter to avoid consecutive duplicates
    const prevBlockNumber = blockNumber > 1 ? blockNumber - 1 : 3;
    const forbiddenLetter = blockLastCorrectLetters[prevBlockNumber];

    // Allowed letters for this block that differ from the forbidden letter
    const eligibleLetters = LETTERS.filter(l => l !== forbiddenLetter);

    // Randomly select distinct questions from the 50-variant bank
    const shuffledBank = [...fullBank].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffledBank.slice(0, questionsCount);

    const processedQuestions: PsychometricQuestion[] = [];
    const assignedLetters: OptionLetter[] = [];

    selectedQuestions.forEach((q, qIndex) => {
      // Choose target letter for the correct answer
      let targetCorrectLetter: OptionLetter;
      if (qIndex === 0) {
        // Enforce anti-pattern strictly: must not equal forbidden letter!
        targetCorrectLetter = eligibleLetters[Math.floor(Math.random() * eligibleLetters.length)];
      } else {
        // Also avoid duplicate letter in immediate consecutive question inside the exam
        const prevQuesLetter = assignedLetters[qIndex - 1];
        const localEligible = LETTERS.filter(l => l !== prevQuesLetter);
        targetCorrectLetter = localEligible[Math.floor(Math.random() * localEligible.length)];
      }

      assignedLetters.push(targetCorrectLetter);

      // Distribute the 4 psychometric roles across the 4 letters (A, B, C, D)
      const optionsArray: QuestionOption[] = Array.isArray(q.options)
        ? q.options
        : [
            { id: `${q.id}_a`, letter: 'A', text: q.options?.A || '', psychometricRole: 'correct', isCorrect: true },
            { id: `${q.id}_b`, letter: 'B', text: q.options?.B || '', psychometricRole: 'similar_false', isCorrect: false },
            { id: `${q.id}_c`, letter: 'C', text: q.options?.C || '', psychometricRole: 'completely_false', isCorrect: false },
            { id: `${q.id}_d`, letter: 'D', text: q.options?.D || '', psychometricRole: 'confusing_false', isCorrect: false }
          ];

      const correctOptSource = optionsArray.find((o: any) => o.psychometricRole === 'correct') || optionsArray[0];
      const similarOptSource = optionsArray.find((o: any) => o.psychometricRole === 'similar_false') || optionsArray[1] || optionsArray[0];
      const completeFalseOptSource = optionsArray.find((o: any) => o.psychometricRole === 'completely_false') || optionsArray[2] || optionsArray[0];
      const confusingOptSource = optionsArray.find((o: any) => o.psychometricRole === 'confusing_false') || optionsArray[3] || optionsArray[0];

      // The remaining 3 letters for distractors
      const remainingLetters = LETTERS.filter(l => l !== targetCorrectLetter);
      // Shuffle distractor letters
      const shuffledDistractorLetters = [...remainingLetters].sort(() => 0.5 - Math.random());

      const finalOptions: QuestionOption[] = [
        {
          id: `${q.id}_opt_${targetCorrectLetter}`,
          letter: targetCorrectLetter,
          text: correctOptSource.text,
          psychometricRole: 'correct' as PsychometricRole,
          isCorrect: true
        },
        {
          id: `${q.id}_opt_${shuffledDistractorLetters[0]}`,
          letter: shuffledDistractorLetters[0],
          text: similarOptSource.text,
          psychometricRole: 'similar_false' as PsychometricRole,
          isCorrect: false
        },
        {
          id: `${q.id}_opt_${shuffledDistractorLetters[1]}`,
          letter: shuffledDistractorLetters[1],
          text: completeFalseOptSource.text,
          psychometricRole: 'completely_false' as PsychometricRole,
          isCorrect: false
        },
        {
          id: `${q.id}_opt_${shuffledDistractorLetters[2]}`,
          letter: shuffledDistractorLetters[2],
          text: confusingOptSource.text,
          psychometricRole: 'confusing_false' as PsychometricRole,
          isCorrect: false
        }
      ].sort((a, b) => a.letter.localeCompare(b.letter)); // Sort alphabetically A, B, C, D

      processedQuestions.push({
        ...q,
        correctLetter: targetCorrectLetter,
        options: finalOptions
      });
    });

    // Update state for adjacent block anti-pattern tracking
    blockLastCorrectLetters[blockNumber] = assignedLetters[0];

    return {
      blockId,
      blockNumber,
      questions: processedQuestions,
      assignedLetters,
      sessionSeed: `SEED-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      startedAt: Date.now()
    };
  }

  /**
   * Evaluates student submission with 100% strictness requirement
   */
  public static evaluateExam(
    session: ActiveExamSession, 
    userAnswers: Record<string, OptionLetter>
  ): {
    scorePercentage: number;
    isPassed: boolean;
    totalQuestions: number;
    correctCount: number;
    incorrectCount: number;
    detailedFeedback: Array<{
      questionId: string;
      prompt: string;
      userLetter: OptionLetter;
      correctLetter: OptionLetter;
      isCorrect: boolean;
      userRoleChosen: PsychometricRole;
      explanation: string;
    }>;
  } {
    let correctCount = 0;
    const totalQuestions = session.questions.length;
    const detailedFeedback: Array<{
      questionId: string;
      prompt: string;
      userLetter: OptionLetter;
      correctLetter: OptionLetter;
      isCorrect: boolean;
      userRoleChosen: PsychometricRole;
      explanation: string;
    }> = [];

    session.questions.forEach(q => {
      const userLetter = userAnswers[q.id];
      const isCorrect = userLetter === q.correctLetter;
      if (isCorrect) correctCount++;

      const chosenOption = Array.isArray(q.options) ? q.options.find((o: any) => o.letter === userLetter) : null;
      const userRoleChosen: PsychometricRole = chosenOption ? chosenOption.psychometricRole : 'completely_false';

      detailedFeedback.push({
        questionId: q.id,
        prompt: q.prompt || q.question || '',
        userLetter,
        correctLetter: q.correctLetter || 'A',
        isCorrect,
        userRoleChosen,
        explanation: q.explanation
      });
    });

    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
    // Requisito oficial: al menos 4 preguntas del examen respondidas correctamente (reemplaza regla del 70%)
    const isPassed = correctCount >= 4;

    return {
      scorePercentage,
      isPassed,
      totalQuestions,
      correctCount,
      incorrectCount: totalQuestions - correctCount,
      detailedFeedback
    };
  }
}
