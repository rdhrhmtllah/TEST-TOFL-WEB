<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <!-- Background decorative elements -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-40 -right-32 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 floating"
      ></div>
      <div
        class="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 floating"
        style="animation-delay: 2s"
      ></div>
      <div
        class="absolute top-40 left-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 floating"
        style="animation-delay: 4s"
      ></div>
    </div>

    <div class="container max-w-6xl mx-auto p-4 md:p-8 relative z-10">
      <!-- Header -->
      <header class="text-center mb-8 md:mb-12">
        <h1
          class="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4"
        >
          TOEFL Master
        </h1>
        <p class="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Tingkatkan kemampuan bahasa Inggris Anda dengan AI-powered learning experience
        </p>
      </header>

      <!-- Modals -->
      <Modal
        :show="showResetModal"
        title="Reset Tes?"
        message="Apakah Anda yakin ingin mereset tes? Semua progress akan hilang."
        confirmText="Ya, Reset"
        confirmColor="bg-gradient-to-r from-red-500 to-pink-600"
        @close="showResetModal = false"
        @cancel="showResetModal = false"
        @confirm="handleReset"
      />

      <Modal
        :show="showLoadModal"
        title="Latih Soal Rekomendasi AI"
        message="Ini akan me-reset tes Anda saat ini dan memuat soal baru yang direkomendasikan AI berdasarkan performa Anda."
        confirmText="Muat Soal Rekomendasi"
        confirmColor="bg-gradient-to-r from-green-500 to-teal-600"
        @close="showLoadModal = false"
        @cancel="showLoadModal = false"
        @confirm="handleLoadRecommended"
      />

      <!-- Screen Navigation -->
      <div class="space-y-8">
        <SourceSelection
          v-if="quizState.screen === 'source'"
          @select="setSource"
          class="card-hover"
        />
        <AiGenerator
          v-if="quizState.screen === 'ai'"
          @questions-generated="startQuiz"
          @back="goBack('source')"
          class="card-hover"
        />
        <ImportExport
          v-if="quizState.screen === 'import'"
          :defaultData="defaultQuizData"
          @questions-loaded="startQuiz"
          @back="goBack('source')"
          class="card-hover"
        />
        <TimeSetup
          v-if="quizState.screen === 'time'"
          :questionCount="quizState.questions.length"
          @start-quiz="handleStartTimer"
          @back="goBack('source')"
          class="card-hover"
        />

        <!-- Quiz Screen -->
        <QuizScreen
          v-if="quizState.screen === 'quiz' || quizState.screen === 'results'"
          @quizReset="confirmReset"
          class="card-hover"
        />

        <!-- Results Analysis -->
        <ResultsAnalysis
          v-if="quizState.screen === 'results'"
          :score="score"
          :totalQuestions="gradableQuestions"
          :timeTaken="timeTaken"
          :incorrectQuestions="incorrectQuestions"
          @reset="confirmReset"
          @loadRecommended="confirmLoadRecommended"
          class="card-hover mt-8"
        />
      </div>

      <!-- Footer -->
      <footer class="text-center mt-12 pt-8 border-t border-gray-200/50">
        <p class="text-gray-500 text-sm">
          Dibuat dengan ❤️ untuk pembelajaran TOEFL yang lebih baik
        </p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { useQuiz } from "../src/composables/useQuiz";
import { defaultQuizData } from "../data/defaultQuizData";

// Components
import SourceSelection from "../components/SourceSelection.vue";
import AiGenerator from "../components/AiGenerator.vue";
import ImportExport from "../components/ImportExport.vue";
import TimeSetup from "../components/TimeSetup.vue";
import QuizScreen from "../components/QuizScreen.vue";
import ResultsAnalysis from "../components/ResultsAnalysis.vue";
import Modal from "../components/Modal.vue";

// Quiz state management
const {
  quizState,
  setSource,
  startQuiz,
  goBack,
  startTimer,
  confirmReset,
  handleReset,
  confirmLoadRecommended,
  handleLoadRecommended,
  showResetModal,
  showLoadModal,
  score,
  gradableQuestions,
  timeTaken,
  incorrectQuestions,
} = useQuiz();

function handleStartTimer(totalSeconds) {
  startTimer(totalSeconds);
}
</script>
