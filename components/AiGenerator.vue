<template>
  <div class="white p-8 md:p-12 rounded-2xl shadow-lg">
    <header class="mb-8 text-center">
      <h1 class="text-3xl md:text-4xl font-bold text-blue-700 mb-3">Buat Soal dengan AI</h1>
      <p class="text-lg text-gray-600">Minta soal apa saja (Reading, Listening, Structure, dll.)</p>
    </header>
    <div class="max-w-md mx-auto space-y-4">
      <div>
        <label for="ai-custom-prompt" class="block text-lg font-medium text-gray-700 mb-2"
          >Permintaan Soal (Prompt):</label
        >
        <textarea
          v-model="prompt"
          id="ai-custom-prompt"
          class="w-full p-3 border border-gray-300 rounded-lg text-lg"
          rows="4"
          placeholder="Contoh: Buatkan 5 soal Listening tentang percakapan di bandara."
        ></textarea>
      </div>
      <div>
        <label for="ai-count" class="block text-lg font-medium text-gray-700 mb-2"
          >Jumlah Soal:</label
        >
        <input
          type="number"
          v-model.number="count"
          id="ai-count"
          class="w-full p-3 border border-gray-300 rounded-lg text-lg"
          min="1"
          max="50"
        />
      </div>

      <button
        @click="generateQuestions"
        :disabled="isLoading"
        class="w-full blue-600 text-white font-bold py-3 px-10 rounded-lg shadow-md hover:blue-700 transition duration-300 text-xl mt-6 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <span v-if="!isLoading">Generate Soal</span>
        <div v-if="isLoading" class="loader"></div>
      </button>

      <span v-if="error" class="text-red-600 text-sm mt-2 block text-center">{{ error }}</span>

      <button
        @click="$emit('back')"
        class="w-full text-center text-gray-600 hover:text-blue-600 mt-4"
      >
        &larr; Kembali
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { callGemini } from "../services/gemini.js";

const emit = defineEmits(["back", "questions-generated"]);

const prompt = ref("");
const count = ref(5);
const isLoading = ref(false);
const error = ref("");

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

async function generateQuestions() {
  if (!prompt.value.trim() || count.value <= 0) {
    error.value = "Silakan isi prompt dan jumlah soal yang valid.";
    return;
  }

  isLoading.value = true;
  error.value = "";

  const fullPrompt = `Tolong buatkan ${count.value} soal tes TOEFL berdasarkan permintaan pengguna berikut:
----
PENGGUNA: "${prompt.value}"
----

Aturan Format Penting:
1. 'type': HARUS 'structure', 'expression', 'reading', 'listening', 'writing', atau 'speaking'.
2. 'passage': (HANYA untuk 'reading' atau 'listening') HARUS berisi wacana bacaan atau naskah audio (script). JANGAN tampilkan naskah di pertanyaan.
3. 'question' (structure): HARUS berisi '______'.
4. 'question' (expression): HARUS berisi 4 bagian <u>teks (A)</u>, <u>teks (B)</u>, dst.
5. 'question' (reading/listening): Pertanyaan berdasarkan 'passage'.
6. 'question' (writing/speaking): Prompt untuk tugas menulis/berbicara.
7. 'options' (structure/expression/reading/listening): HARUS 4 pilihan, cth: ["(A) ...", "(B) ..."].
8. 'options' (writing/speaking): Boleh array kosong [].
9. 'answer': (A, B, C, atau D) untuk tipe structure/expression/reading/listening. Boleh string kosong "" untuk writing/speaking.
10. JANGAN sertakan nomor soal di dalam string 'question'.`;

  try {
    const jsonString = await callGemini(fullPrompt, schema);
    if (!jsonString) {
      throw new Error("Gagal mendapatkan respon dari AI.");
    }
    const generatedQuestions = JSON.parse(jsonString);
    if (!Array.isArray(generatedQuestions) || generatedQuestions.length === 0) {
      throw new Error("AI tidak mengembalikan format soal yang valid.");
    }
    emit("questions-generated", generatedQuestions);
  } catch (err) {
    console.error("Gagal generate soal:", err);
    error.value = `Error: ${err.message}. Silakan coba lagi.`;
  } finally {
    isLoading.value = false;
  }
}
</script>
