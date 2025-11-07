<template>
  <div class="container max-w-4xl mx-auto p-4 md:p-8">
    <!-- 
      Modal sekarang dikontrol oleh state global dari useQuiz.
      Kita menggunakan v-model untuk two-way binding.
    -->
    <Modal
      :show="showResetModal"
      title="Konfirmasi Reset"
      message="Apakah Anda yakin ingin mereset tes? Ini akan menghapus skor Anda dan kembali ke layar mulai."
      confirmText="Yakin, Reset"
      confirmColor="bg-red-600"
      @close="showResetModal = false"
      @cancel="showResetModal = false"
      @confirm="handleReset"
    />

    <Modal
      :show="showLoadModal"
      title="Latih Soal Rekomendasi?"
      message="Ini akan me-reset tes Anda saat ini dan memuat soal baru yang direkomendasikan AI. Anda akan dibawa ke layar pengaturan waktu."
      confirmText="Ya, Latih Soal Ini"
      confirmColor="bg-green-600"
      @close="showLoadModal = false"
      @cancel="showLoadModal = false"
      @confirm="handleLoadRecommended"
    />

    <!-- Navigasi Layar (hanya menampilkan 1 per 1) -->
    <SourceSelection v-if="quizState.screen === 'source'" @select="setSource" />
    <AiGenerator
      v-if="quizState.screen === 'ai'"
      @questions-generated="startQuiz"
      @back="goBack('source')"
    />
    <ImportExport
      v-if="quizState.screen === 'import'"
      :defaultData="defaultQuizData"
      @questions-loaded="startQuiz"
      @back="goBack('source')"
    />
    <TimeSetup
      v-if="quizState.screen === 'time'"
      :questionCount="quizState.questions.length"
      @start-quiz="handleStartTimer"
      @back="goBack('source')"
    />

    <!-- 
      QuizScreen sekarang tetap terlihat di layar 'quiz' DAN 'results'
    -->
    <QuizScreen
      v-if="quizState.screen === 'quiz' || quizState.screen === 'results'"
      @quizReset="confirmReset"
    />

    <!-- 
      ResultsAnalysis sekarang muncul DI BAWAH QuizScreen saat layar 'results'
    -->
    <ResultsAnalysis
      v-if="quizState.screen === 'results'"
      :score="score"
      :totalQuestions="gradableQuestions"
      :timeTaken="timeTaken"
      :incorrectQuestions="incorrectQuestions"
      @reset="confirmReset"
      @loadRecommended="confirmLoadRecommended"
      class="mt-8"
    />
  </div>
</template>

<script setup>
// [PERBAIKAN] Logika state dipindahkan ke useQuiz
import { useQuiz } from "../src/composables/useQuiz";
import { defaultQuizData } from "../data/defaultQuizData"; // Impor data untuk ImportExport

// Komponen-komponen layar
import SourceSelection from "../components/SourceSelection.vue";
import AiGenerator from "../components/AiGenerator.vue";
import ImportExport from "../components/ImportExport.vue";
import TimeSetup from "../components/TimeSetup.vue";
import QuizScreen from "../components/QuizScreen.vue";
import ResultsAnalysis from "../components/ResultsAnalysis.vue";
import Modal from "../components/Modal.vue";

// Ambil state dan fungsi dari composable
const {
  quizState,
  setSource,
  startQuiz,
  goBack,
  startTimer, // ganti nama agar tidak konflik
  confirmReset,
  handleReset,
  confirmLoadRecommended,
  handleLoadRecommended,
  showResetModal,
  showLoadModal,

  // Ambil state hasil untuk di-pass ke ResultsAnalysis
  score,
  gradableQuestions,
  timeTaken,
  incorrectQuestions,
} = useQuiz();

// [PERBAIKAN] Buat fungsi wrapper untuk startTimer
// Ini diperlukan karena QuizScreen perlu menyimpan initialTime
function handleStartTimer(totalSeconds) {
  // (Di useQuiz.js, kita perlu menyimpan `initialTotalSeconds`)
  // Mari kita perbaiki useQuiz.js... (lihat file berikutnya)

  // Untuk sekarang, kita anggap startTimer di useQuiz sudah benar
  startTimer(totalSeconds);
}
</script>
