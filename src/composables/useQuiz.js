import { ref, reactive, computed, readonly } from "vue";
import { defaultQuizData } from "../../data/defaultQuizData";

// 1. STATE REAKTIF (GLOBAL)
const quizState = reactive({
  screen: "source", // source, ai, import, time, quiz, results
  questions: [],
  userAnswers: {},
  score: 0,
  gradableQuestions: 0,
  incorrectQuestions: [],
  isSubmitted: false,
  isAutoSubmit: false, // [BARU] Untuk melacak apakah waktu habis
  initialTotalSeconds: 0, // [BARU] Untuk menyimpan waktu awal
  secondsRemaining: 0,
  timeTaken: 0, // [BARU] Waktu pengerjaan (initial - sisa)
  timerInterval: null,
  showResetModal: false,
  showLoadModal: false,
  recommendedQuestionsToLoad: [],
});

// 2. FUNGSI TIMER
function stopTimer() {
  clearInterval(quizState.timerInterval);
}

function startTimer(totalSeconds) {
  quizState.initialTotalSeconds = totalSeconds; // [BARU] Simpan waktu awal
  quizState.secondsRemaining = totalSeconds;
  quizState.timerInterval = setInterval(() => {
    quizState.secondsRemaining--;
    if (quizState.secondsRemaining <= 0) {
      stopTimer();
      submitQuiz(true); // Auto-submit
    }
  }, 1000);

  quizState.screen = "quiz";
}

// 3. FUNGSI NAVIGASI & SETUP
function setSource(source, questions = null) {
  if (source === "default") {
    quizState.questions = [...defaultQuizData];
    quizState.screen = "time";
  } else if (source === "ai") {
    quizState.screen = "ai";
  } else if (source === "import") {
    quizState.screen = "import";
  }
}

function goBack(screen) {
  quizState.screen = screen;
}

function loadQuestions(questions) {
  resetQuiz(); // Reset dulu sebelum memuat soal baru
  quizState.questions = questions;
  quizState.screen = "time";
}

function startQuiz(questions) {
  quizState.questions = questions;
  // Inisialisasi userAnswers
  quizState.userAnswers = {};
  quizState.questions.forEach((_, index) => {
    quizState.userAnswers[index] = null;
  });
  quizState.screen = "time";
}

// 4. FUNGSI LOGIKA KUIS (RESET & SUBMIT)
function resetQuiz() {
  stopTimer();
  quizState.screen = "source";
  quizState.questions = [];
  quizState.userAnswers = {};
  quizState.score = 0;
  quizState.gradableQuestions = 0;
  quizState.incorrectQuestions = [];
  quizState.isSubmitted = false;
  quizState.isAutoSubmit = false; // [BARU] Reset
  quizState.initialTotalSeconds = 0; // [BARU] Reset
  quizState.secondsRemaining = 0;
  quizState.timeTaken = 0;
  window.speechSynthesis.cancel();
}

function submitQuiz(isAutoSubmit = false) {
  if (quizState.isSubmitted) return;
  quizState.isSubmitted = true;
  quizState.isAutoSubmit = isAutoSubmit; // [BARU] Catat cara submit

  // [PERBAIKAN] Hitung waktu pengerjaan yang benar
  quizState.timeTaken = quizState.initialTotalSeconds - quizState.secondsRemaining;
  stopTimer();

  let currentScore = 0;
  let currentGradable = 0;
  const incorrect = [];

  quizState.questions.forEach((item, index) => {
    const isGradable = item.options && item.options.length > 1;
    if (!isGradable) return;

    currentGradable++;
    const userAnswer = quizState.userAnswers[index];
    const correctAnswer = item.answer;

    if (userAnswer === correctAnswer) {
      currentScore++;
    } else {
      incorrect.push({ ...item, userAnswer: userAnswer || "Tidak Dijawab" });
    }
  });

  quizState.score = currentScore;
  quizState.gradableQuestions = currentGradable;
  quizState.incorrectQuestions = incorrect;
  quizState.screen = "results";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// 5. FUNGSI MODAL (DARI APP.VUE)
function confirmReset() {
  quizState.showResetModal = true;
}

function handleReset() {
  resetQuiz();
  quizState.showResetModal = false;
}

function confirmLoadRecommended(questions) {
  quizState.recommendedQuestionsToLoad = questions;
  quizState.showLoadModal = true;
}

function handleLoadRecommended() {
  // Panggil 'loadQuestions' BUKAN 'startQuiz'
  loadQuestions(quizState.recommendedQuestionsToLoad);
  quizState.showLoadModal = false;
}

// 6. EXPORT FUNGSI COMPOSABLE
export function useQuiz() {
  return {
    quizState: readonly(quizState),
    setSource,
    startQuiz,
    goBack,
    startTimer,
    resetQuiz,
    loadQuestions,
    submitQuiz,
    confirmReset,
    handleReset,
    confirmLoadRecommended,
    handleLoadRecommended,

    showResetModal: computed({
      get: () => quizState.showResetModal,
      set: (val) => {
        quizState.showResetModal = val;
      },
    }),
    showLoadModal: computed({
      get: () => quizState.showLoadModal,
      set: (val) => {
        quizState.showLoadModal = val;
      },
    }),

    userAnswers: quizState.userAnswers, // Writable
    isSubmitted: readonly(computed(() => quizState.isSubmitted)),
    isAutoSubmit: readonly(computed(() => quizState.isAutoSubmit)), // [BARU]
    secondsRemaining: readonly(computed(() => quizState.secondsRemaining)),
    score: readonly(computed(() => quizState.score)),
    gradableQuestions: readonly(computed(() => quizState.gradableQuestions)),
    incorrectQuestions: readonly(computed(() => quizState.incorrectQuestions)),
    timeTaken: readonly(computed(() => quizState.timeTaken)), // [BARU]
  };
}
