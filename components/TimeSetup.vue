<template>
  <div class="white p-8 md:p-12 rounded-2xl shadow-lg text-center">
    <header class="mb-8">
      <h1 class="text-3xl md:text-4xl font-bold text-blue-700 mb-3">Siapkan Tes Anda</h1>
      <p class="text-lg text-gray-600">Langkah 2: Atur Durasi Tes</p>
    </header>
    <div class="max-w-xs mx-auto">
      <p class="text-lg text-gray-700 mb-4">
        Jumlah Soal: <strong class="text-blue-700">{{ questionCount }}</strong>
      </p>
      <label for="time-input" class="block text-lg font-medium text-gray-700 mb-2"
        >Atur Durasi (menit):</label
      >
      <input
        type="number"
        v-model.number="timeInMinutes"
        id="time-input"
        class="w-full p-3 border border-gray-300 rounded-lg text-center text-xl"
        min="1"
      />
      <span v-if="error" class="text-red-600 text-sm mt-1 block">{{ error }}</span>
      <button
        @click="start"
        class="w-full bg-blue-600 text-white font-bold py-3 px-10 rounded-lg shadow-md hover:blue-700 transition duration-300 text-xl mt-6"
      >
        Mulai Tes
      </button>
      <button
        @click="$emit('back')"
        class="w-full text-center text-gray-600 hover:text-blue-600 mt-6"
      >
        &larr; Ganti Sumber Soal
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  questionCount: {
    type: Number,
    required: true,
  },
});
const emit = defineEmits(["back", "start-quiz"]);

const timeInMinutes = ref(props.questionCount > 0 ? props.questionCount : 40);
const error = ref("");

function start() {
  if (timeInMinutes.value <= 0) {
    error.value = "Masukkan durasi yang valid (minimal 1 menit).";
    return;
  }
  error.value = "";
  emit("start-quiz", timeInMinutes.value * 60);
}
</script>
