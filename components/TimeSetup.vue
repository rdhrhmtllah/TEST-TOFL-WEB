<template>
  <div class="card max-w-md mx-auto text-center">
    <!-- Header -->
    <div class="mb-8">
      <div
        class="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg"
      >
        <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h1
        class="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-3"
      >
        Atur Waktu Tes
      </h1>
      <p class="text-gray-600">Langkah terakhir sebelum memulai tantangan</p>
    </div>

    <!-- Question Count -->
    <div
      class="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-200 mb-6"
    >
      <div class="flex items-center justify-between mb-4">
        <span class="text-lg font-semibold text-gray-700">Jumlah Soal</span>
        <div class="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
          {{ questionCount }} Soal
        </div>
      </div>
      <div class="text-sm text-gray-600">
        ⏱️ Rata-rata <strong>{{ Math.ceil((questionCount / 40) * 60) }}</strong> detik per soal
      </div>
    </div>

    <!-- Time Input -->
    <div class="space-y-4">
      <label
        for="time-input"
        class="block text-lg font-semibold text-gray-700 text-left flex items-center gap-2"
      >
        <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Durasi Tes (menit):
      </label>

      <div class="relative">
        <input
          type="number"
          v-model.number="timeInMinutes"
          id="time-input"
          class="w-full p-4 border-2 border-orange-200 rounded-2xl text-2xl font-bold text-center focus:border-orange-500 focus:ring-4 focus:ring-orange-200 transition-all duration-300"
          min="1"
          :max="maxTime"
        />
        <div class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
          menit
        </div>
      </div>

      <!-- Time Suggestions -->
      <div class="flex gap-2 justify-center flex-wrap">
        <button
          v-for="suggestion in timeSuggestions"
          :key="suggestion"
          @click="timeInMinutes = suggestion"
          class="px-4 py-2 bg-white border border-orange-200 text-orange-600 rounded-xl hover:bg-orange-50 transition-all duration-200 text-sm font-semibold"
        >
          {{ suggestion }}m
        </button>
      </div>

      <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
        {{ error }}
      </div>

      <!-- Time Summary -->
      <div
        class="bg-gradient-to-br from-green-50 to-teal-50 p-4 rounded-2xl border border-green-200"
      >
        <div class="text-sm text-gray-600 mb-2">Ringkasan Waktu:</div>
        <div class="text-lg font-semibold text-green-700">
          {{ timeInMinutes }} menit = {{ Math.floor(timeInMinutes / 60) }} jam
          {{ timeInMinutes % 60 }} menit
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="space-y-4 mt-8">
      <button
        @click="start"
        class="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 text-lg flex items-center justify-center gap-3"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Mulai Tes Sekarang
      </button>

      <button
        @click="$emit('back')"
        class="w-full btn-secondary text-center flex items-center justify-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Kembali ke Pilihan Soal
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

const timeInMinutes = ref(Math.max(1, Math.ceil((props.questionCount / 40) * 60)));
const error = ref("");

const maxTime = computed(() => Math.min(300, props.questionCount * 3)); // Max 5 hours or 3 min per question

const timeSuggestions = computed(() => {
  const baseTime = Math.ceil((props.questionCount / 40) * 60);
  return [
    Math.max(1, Math.floor(baseTime * 0.5)), // 50% of estimated time
    baseTime, // estimated time
    Math.min(maxTime.value, Math.ceil(baseTime * 1.5)), // 150% of estimated time
    Math.min(maxTime.value, Math.ceil(baseTime * 2)), // 200% of estimated time
  ].filter((time, index, array) => array.indexOf(time) === index); // Remove duplicates
});

function start() {
  if (timeInMinutes.value <= 0) {
    error.value = "Durasi harus lebih dari 0 menit";
    return;
  }
  if (timeInMinutes.value > maxTime.value) {
    error.value = `Durasi maksimal adalah ${maxTime.value} menit`;
    return;
  }
  error.value = "";
  emit("start-quiz", timeInMinutes.value * 60);
}
</script>
