<template>
  <div class="card max-w-2xl mx-auto">
    <div class="text-center mb-8">
      <div
        class="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg"
      >
        <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      </div>
      <h1
        class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3"
      >
        AI Question Generator
      </h1>
      <p class="text-gray-600 text-lg">Minta AI untuk membuat soal custom sesuai kebutuhan Anda</p>
    </div>

    <div class="space-y-6">
      <div>
        <label
          for="ai-custom-prompt"
          class="block text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2"
        >
          <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          Permintaan Soal:
        </label>
        <textarea
          v-model="prompt"
          id="ai-custom-prompt"
          class="w-full p-4 border-2 border-gray-200 rounded-2xl text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-300 resize-none"
          rows="4"
          placeholder="Contoh: Buatkan 5 soal Listening tentang percakapan di bandara dengan tingkat kesulitan menengah..."
        ></textarea>
        <div class="flex justify-between text-sm text-gray-500 mt-2">
          <span>Detailkan permintaan Anda</span>
          <span>{{ prompt.length }}/500</span>
        </div>
      </div>

      <div>
        <label
          for="ai-count"
          class="block text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2"
        >
          <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          Jumlah Soal:
        </label>
        <div class="relative">
          <input
            type="number"
            v-model.number="count"
            id="ai-count"
            class="w-full p-4 border-2 border-gray-200 rounded-2xl text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-300"
            min="1"
            max="50"
          />
          <div class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">soal</div>
        </div>
      </div>

      <button
        @click="generateQuestions"
        :disabled="isLoading"
        class="btn-primary w-full text-lg py-4 rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg"
      >
        <span v-if="!isLoading">🎯 Generate Soal AI</span>
        <span v-else>Generating...</span>
        <div v-if="isLoading" class="loader !w-6 !h-6"></div>
      </button>

      <div
        v-if="error"
        class="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-center"
      >
        {{ error }}
      </div>

      <button
        @click="$emit('back')"
        class="btn-secondary w-full text-center flex items-center justify-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Kembali ke Pilihan Sumber
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { callGemini } from "../services/gemini.js";

const emit = defineEmits(["back", "questions-generated"]);

const prompt = ref("");
const count = ref(5);
const isLoading = ref(false);
const error = ref("");

// Schema untuk AI
const schema = {
  type: "ARRAY",
  items: {
    type: "OBJECT",
    properties: {
      type: { type: "STRING" },
      passage: { type: "STRING" },
      question: { type: "STRING" },
      options: {
        type: "ARRAY",
        items: { type: "STRING" },
      },
      answer: { type: "STRING" },
    },
    required: ["type", "question", "options", "answer"],
  },
};

// Watch prompt length
watch(prompt, (newVal) => {
  if (newVal.length > 500) {
    prompt.value = newVal.slice(0, 500);
  }
});

async function generateQuestions() {
  if (!prompt.value.trim() || count.value <= 0) {
    error.value = "Silakan isi prompt dan jumlah soal yang valid.";
    return;
  }

  isLoading.value = true;
  error.value = "";

  const fullPrompt = `Sebagai ahli pembuat soal TOEFL, buatkan ${count.value} soal berdasarkan permintaan:
"${prompt.value}"

FORMAT WAJIB:
1. type: HARUS 'structure', 'expression', 'reading', 'listening', 'writing', atau 'speaking'
2. passage: HANYA untuk reading/listening (jika tidak ada, gunakan "")
3. question: Untuk structure harus ada '______', untuk expression gunakan <u>teks (A)</u> format
4. options: 4 pilihan ["(A)...", "(B)..."] untuk structure/expression/reading/listening
5. answer: A, B, C, atau D (atau "" untuk writing/speaking)
6. Semua dalam Bahasa Inggris kecuali instruksi khusus`;

  try {
    const jsonString = await callGemini(fullPrompt, schema);
    if (!jsonString) {
      throw new Error("AI tidak merespons. Coba lagi.");
    }

    const generatedQuestions = JSON.parse(jsonString);
    if (!Array.isArray(generatedQuestions) || generatedQuestions.length === 0) {
      throw new Error("Format soal tidak valid dari AI.");
    }

    emit("questions-generated", generatedQuestions);
  } catch (err) {
    console.error("Generate error:", err);
    error.value = `Error: ${err.message}`;
  } finally {
    isLoading.value = false;
  }
}
</script>
