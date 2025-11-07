<template>
  <div>
    <!-- Header Skor & Kontrol (Sticky) -->
    <div class="sticky top-0 z-10 bg-white shadow-md mb-6">
      <div class="max-w-4xl mx-auto p-3">
        <div class="flex flex-col sm:flex-row justify-between items-center flex-wrap gap-3">
          <div>
            <span class="text-lg font-bold text-blue-700">Skor: </span>
            <span class="text-lg font-bold text-gray-800"
              >{{ score }} / {{ gradableQuestions }}</span
            >
          </div>
          <div>
            <span class="text-lg font-bold text-blue-700">Sisa Waktu: </span>
            <span
              :class="[
                'text-lg font-bold',
                secondsRemaining <= 60 && !isSubmitted ? 'text-red-600' : 'text-gray-800',
              ]"
              >{{ formattedTime }}</span
            >
          </div>
          <div class="flex gap-2 flex-wrap justify-center">
            <button
              @click="$emit('quizReset')"
              class="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300 text-sm"
            >
              Reset Tes
            </button>
          </div>
        </div>

        <!-- [PERBAIKAN] Hasil Akhir sekarang ditampilkan DI SINI saat submit -->
        <div v-if="isSubmitted" class="mt-3 pt-3 border-t border-gray-200 text-center">
          <!-- [PERBAIKAN] Gunakan 'isAutoSubmit' untuk menentukan pesan -->
          <h2 :class="[isAutoSubmit ? 'text-red-600' : 'text-green-600', 'text-2xl font-bold']">
            {{ isAutoSubmit ? "Waktu Habis!" : "Tes Selesai!" }}
          </h2>
          <p class="text-lg text-gray-700 mt-1">Skor Anda: {{ score }} / {{ gradableQuestions }}</p>
          <p class="text-3xl font-bold text-blue-700 mt-2">Nilai: {{ percentage }}</p>
          <!-- [PERBAIKAN] Gunakan 'formattedTimeTaken' yang baru -->
          <p class="text-lg text-gray-700 mt-1">Waktu Pengerjaan: {{ formattedTimeTaken }}</p>
        </div>
      </div>
    </div>

    <!-- Kontainer Soal (dalam Form) -->
    <form @submit.prevent="handleSubmit" class="bg-white p-6 md:p-10 rounded-2xl shadow-lg">
      <!-- Bagian 1: Structure -->
      <template v-if="structureQuestions.length > 0">
        <h2 class="text-2xl font-bold text-gray-800 border-b-2 border-blue-200 pb-2 mb-6">
          Bagian 1: Structure
        </h2>
        <p class="text-gray-600 mb-6">
          Pilih satu jawaban yang paling tepat untuk melengkapi kalimat.
        </p>
        <QuizQuestion
          v-for="(question, index) in structureQuestions"
          :key="'s-' + index"
          :question="question.data"
          :question-number="question.originalIndex + 1"
          :is-submitted="isSubmitted"
          v-model="userAnswers[question.originalIndex]"
        />
      </template>

      <!-- Bagian 2: Written Expression -->
      <template v-if="expressionQuestions.length > 0">
        <h2 class="text-2xl font-bold text-gray-800 border-b-2 border-blue-200 pb-2 mb-6 mt-12">
          Bagian 2: Written Expression
        </h2>
        <p class="text-gray-600 mb-6">
          Pilih satu bagian yang digarisbawahi yang salah secara tata bahasa.
        </p>
        <QuizQuestion
          v-for="(question, index) in expressionQuestions"
          :key="'e-' + index"
          :question="question.data"
          :question-number="question.originalIndex + 1"
          :is-submitted="isSubmitted"
          v-model="userAnswers[question.originalIndex]"
        />
      </template>

      <!-- Bagian 3: Reading -->
      <template v-if="readingGroups.length > 0">
        <h2 class="text-2xl font-bold text-gray-800 border-b-2 border-blue-200 pb-2 mb-6 mt-12">
          Bagian 3: Reading Comprehension
        </h2>
        <p class="text-gray-600 mb-6">
          Baca wacana berikut dan jawab pertanyaan yang menyertainya.
        </p>
        <div v-for="(group, gIndex) in readingGroups" :key="'rg-' + gIndex">
          <div class="reading-passage">{{ group.passage }}</div>
          <QuizQuestion
            v-for="(question, qIndex) in group.questions"
            :key="'rq-' + qIndex"
            :question="question.data"
            :question-number="question.originalIndex + 1"
            :is-submitted="isSubmitted"
            v-model="userAnswers[question.originalIndex]"
          />
        </div>
      </template>

      <!-- Bagian 4: Listening -->
      <template v-if="listeningGroups.length > 0">
        <h2 class="text-2xl font-bold text-gray-800 border-b-2 border-blue-200 pb-2 mb-6 mt-12">
          Bagian 4: Listening
        </h2>
        <p class="text-gray-600 mb-6">Dengarkan audio dan jawab pertanyaan yang menyertainya.</p>
        <div v-for="(group, gIndex) in listeningGroups" :key="'lg-' + gIndex">
          <AudioPlayer :script="group.passage" />
          <QuizQuestion
            v-for="(question, qIndex) in group.questions"
            :key="'lq-' + qIndex"
            :question="question.data"
            :question-number="question.originalIndex + 1"
            :is-submitted="isSubmitted"
            v-model="userAnswers[question.originalIndex]"
          />
        </div>
      </template>

      <!-- Tombol Submit Akhir -->
      <div class="mt-12 text-center">
        <button
          type="submit"
          :disabled="isSubmitted"
          class="w-full md:w-auto bg-blue-600 text-white font-bold py-3 px-10 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 text-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Selesai & Cek Skor
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed, onUnmounted } from "vue";
import { useQuiz } from "../src/composables/useQuiz.js";
import QuizQuestion from "../components/QuizQuestion.vue";
import AudioPlayer from "../components/AudioPlayer.vue";

defineEmits(["quizReset"]);

// Ambil state dan fungsi dari composable
const {
  quizState,
  userAnswers,
  isSubmitted,
  isAutoSubmit, // [BARU]
  secondsRemaining,
  score,
  gradableQuestions,
  timeTaken, // [BARU]
  submitQuiz,
} = useQuiz();

// --- Computed properties untuk tampilan ---

const formattedTime = computed(() => {
  const minutes = Math.floor(secondsRemaining.value / 60);
  const seconds = secondsRemaining.value % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
});

// [BARU] Computed untuk hasil akhir
const percentage = computed(() => {
  return (gradableQuestions.value > 0 ? (score.value / gradableQuestions.value) * 100 : 0).toFixed(
    0
  );
});

// [PERBAIKAN] Computed ini sekarang menggunakan 'timeTaken' dari state
const formattedTimeTaken = computed(() => {
  const totalSeconds = timeTaken.value;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
});

// --- Computed properties untuk mengelompokkan soal ---
const indexedQuestions = computed(() =>
  quizState.questions.map((data, originalIndex) => ({ data, originalIndex }))
);

const structureQuestions = computed(() =>
  indexedQuestions.value.filter((q) => q.data.type === "structure")
);
const expressionQuestions = computed(() =>
  indexedQuestions.value.filter((q) => q.data.type === "expression")
);

const readingGroups = computed(() => groupPassageQuestions("reading"));
const listeningGroups = computed(() => groupPassageQuestions("listening"));

function groupPassageQuestions(type) {
  const groups = [];
  let currentGroup = null;
  indexedQuestions.value
    .filter((q) => q.data.type === type)
    .forEach((q) => {
      // Kelompokkan berdasarkan 'passage' HANYA jika passage ada
      if (q.data.passage) {
        if (q.data.passage !== currentGroup?.passage) {
          currentGroup = { passage: q.data.passage, questions: [q] };
          groups.push(currentGroup);
        } else {
          currentGroup.questions.push(q);
        }
      } else {
        // Jika tidak ada passage (misal reading tapi error), tampilkan sebagai grup sendiri
        groups.push({
          passage: `(Soal ${q.originalIndex + 1} tidak memiliki wacana)`,
          questions: [q],
        });
      }
    });
  return groups;
}

// --- Lifecycle & Submit ---
onUnmounted(() => {
  window.speechSynthesis.cancel();
});

function handleSubmit() {
  submitQuiz(false); // Panggil fungsi submit global (bukan auto-submit)
}
</script>
