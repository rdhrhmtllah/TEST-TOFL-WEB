<template>
  <div class="space-y-8">
    <!-- Score Card -->
    <div class="card text-center relative overflow-hidden">
      <!-- Background decoration -->
      <div
        class="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-r from-green-200 to-blue-200 rounded-full opacity-20"
      ></div>
      <div
        class="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full opacity-20"
      ></div>

      <div class="relative z-10">
        <div
          class="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl"
        >
          <span class="text-white text-2xl font-bold">{{ percentage }}%</span>
        </div>

        <h2
          class="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-3"
        >
          Tes Selesai!
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div
            class="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-2xl border border-green-200"
          >
            <div class="text-3xl font-bold text-green-600 mb-1">
              {{ score }}/{{ totalQuestions }}
            </div>
            <div class="text-sm text-green-700 font-semibold">Skor Akhir</div>
          </div>

          <div
            class="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-2xl border border-blue-200"
          >
            <div class="text-3xl font-bold text-blue-600 mb-1">{{ percentage }}%</div>
            <div class="text-sm text-blue-700 font-semibold">Persentase</div>
          </div>

          <div
            class="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-2xl border border-purple-200"
          >
            <div class="text-2xl font-bold text-purple-600 mb-1">{{ formattedTime }}</div>
            <div class="text-sm text-purple-700 font-semibold">Waktu</div>
          </div>
        </div>

        <button @click="$emit('reset')" class="btn-danger inline-flex items-center gap-2 mx-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Ulang Tes
        </button>
      </div>
    </div>

    <!-- AI Analysis Section -->
    <div class="card">
      <div class="text-center mb-8">
        <div
          class="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg"
        >
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
        <h2
          class="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3"
        >
          Analisa AI
        </h2>
        <p class="text-gray-600 text-lg">
          Dapatkan wawasan mendalam tentang performa dan rekomendasi belajar personal
        </p>
      </div>

      <!-- Analysis Input -->
      <div v-if="!analysis.content" class="max-w-2xl mx-auto">
        <div
          class="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200 mb-6"
        >
          <label
            for="recom-q-count"
            class="block text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2"
          >
            <svg
              class="w-5 h-5 text-purple-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            Jumlah Soal Rekomendasi:
          </label>
          <div class="relative">
            <input
              type="number"
              v-model.number="recomCount"
              id="recom-q-count"
              class="w-full p-4 border-2 border-purple-200 rounded-2xl text-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300"
              min="1"
              max="50"
            />
            <div class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              soal
            </div>
          </div>
        </div>

        <button
          @click="getTestAnalysis"
          :disabled="analysis.isLoading"
          class="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:transform-none"
        >
          <span v-if="!analysis.isLoading">🧠 Dapatkan Analisa & Rekomendasi AI</span>
          <span v-else>Menganalisa Performa...</span>
          <div v-if="analysis.isLoading" class="loader"></div>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="analysis.isLoading && !analysis.content" class="text-center py-12">
        <div class="loader mx-auto mb-4"></div>
        <p class="text-gray-600">AI sedang menganalisa performa Anda...</p>
      </div>

      <!-- Analysis Results -->
      <div v-if="analysis.content" class="space-y-8">
        <!-- Analysis Section -->
        <div
          class="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200"
        >
          <h3 class="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Analisa Kemampuan
          </h3>
          <p class="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {{ analysis.content.analysis }}
          </p>
        </div>

        <!-- Suggestions Section -->
        <div
          class="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-2xl border border-green-200"
        >
          <h3 class="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Saran Perbaikan
          </h3>
          <ul class="space-y-3">
            <li
              v-for="(suggestion, index) in analysis.content.suggestions"
              :key="index"
              class="flex items-start gap-3 text-gray-700"
            >
              <div
                class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              >
                <svg
                  class="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span>{{ suggestion }}</span>
            </li>
          </ul>
        </div>

        <!-- Recommended Questions -->
        <div
          class="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-200"
        >
          <h3 class="text-xl font-bold text-orange-700 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            Soal Latihan Rekomendasi
          </h3>
          <p class="text-gray-600 mb-4">
            Salin kode JSON berikut untuk berlatih dengan soal yang disesuaikan:
          </p>

          <div class="relative">
            <textarea
              :value="analysis.jsonString"
              readonly
              class="w-full h-48 p-4 border-2 border-orange-200 rounded-2xl font-mono text-sm bg-white/50 focus:border-orange-500 focus:ring-4 focus:ring-orange-200 transition-all duration-300 resize-none scrollbar-thin"
            ></textarea>

            <div class="absolute top-3 right-3 flex gap-2">
              <button
                @click="copyJson"
                class="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors duration-200 shadow-md"
                title="Salin JSON"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div class="flex gap-3 mt-4 flex-wrap">
            <button
              @click="copyJson"
              class="bg-orange-500 text-white font-semibold py-2 px-5 rounded-xl hover:bg-orange-600 transition-all duration-300 flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Salin JSON
            </button>

            <button
              @click="$emit('loadRecommended', analysis.content.recommendedQuestions)"
              class="bg-green-500 text-white font-semibold py-2 px-5 rounded-xl hover:bg-green-600 transition-all duration-300 flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              Latih Soal Ini
            </button>

            <button
              @click="downloadAnalysisAsPDF"
              class="bg-gray-600 text-white font-semibold py-2 px-5 rounded-xl hover:bg-gray-700 transition-all duration-300 flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download PDF
            </button>
          </div>

          <span class="ml-2 text-sm text-green-600 mt-2 block">{{ copyStatus }}</span>
        </div>

        <!-- Chat Section -->
        <div
          class="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200"
        >
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold text-purple-700 flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              Diskusi dengan AI Tutor
            </h3>
          </div>

          <div class="ai-explanation-content mb-6" ref="chatContentRef">
            <div
              v-for="(message, index) in analysis.chatHistory"
              :key="index"
              :class="['ai-chat-bubble', message.role]"
            >
              <div class="flex items-center gap-2 mb-2">
                <div
                  class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  :class="message.role === 'user' ? 'bg-blue-500' : 'bg-purple-500'"
                >
                  {{ message.role === "user" ? "A" : "AI" }}
                </div>
                <strong class="text-sm">{{ message.role === "user" ? "Anda" : "AI Tutor" }}</strong>
              </div>
              <div v-html="renderMarkdown(message.parts[0].text)"></div>
            </div>
          </div>

          <!-- Follow-up Input -->
          <div class="bg-white/50 p-4 rounded-2xl border border-purple-100">
            <label
              for="analysis-followup-input"
              class="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2"
            >
              <svg
                class="w-4 h-4 text-purple-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              Tanya lebih lanjut tentang analisamu:
            </label>
            <div class="flex gap-2">
              <input
                type="text"
                v-model="analysis.followUpInput"
                id="analysis-followup-input"
                @keydown.enter.prevent="handleAnalysisFollowUp"
                class="flex-1 p-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300"
                placeholder="Tanya AI tentang strategi belajar..."
                :disabled="analysis.isLoading"
              />
              <button
                type="button"
                @click="handleAnalysisFollowUp"
                class="bg-purple-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-purple-600 transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
                :disabled="analysis.isLoading || !analysis.followUpInput"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                  />
                </svg>
                Tanya
              </button>
            </div>
            <div v-if="analysis.isLoading" class="flex justify-center mt-3">
              <div class="loader !w-5 !h-5"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, nextTick } from "vue";
import { callGemini } from "../services/gemini.js";
import { jsPDF } from "jspdf";

const props = defineProps({
  score: Number,
  totalQuestions: Number,
  timeTaken: Number,
  incorrectQuestions: Array,
});
defineEmits(["reset", "loadRecommended"]);

const recomCount = ref(10);
const copyStatus = ref("");
const chatContentRef = ref(null);

const analysis = reactive({
  isLoading: false,
  content: null,
  jsonString: "",
  chatHistory: [],
  rawHistoryForPDF: [],
  followUpInput: "",
});

// Computed properties
const percentage = computed(() => {
  return (props.totalQuestions > 0 ? (props.score / props.totalQuestions) * 100 : 0).toFixed(0);
});

const formattedTime = computed(() => {
  const minutes = Math.floor(props.timeTaken / 60);
  const seconds = props.timeTaken % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
});

// Markdown renderer
function renderMarkdown(text) {
  if (!text) return "";
  let jsonBlocks = [];

  let processedText = text.replace(/```json([\s\S]*?)```/gs, (match, json) => {
    const safeJson = json.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();
    jsonBlocks.push(
      `<pre class="bg-gray-900 text-white p-3 rounded-lg my-2 overflow-x-auto text-xs">${safeJson}</pre>`
    );
    return `__JSON_BLOCK_${jsonBlocks.length - 1}__`;
  });

  processedText = processedText
    .replace(/\n/g, "<br>")
    .replace(/## (.*?)<br>/g, "<h3 class='text-purple-600 font-semibold mt-4 mb-2 text-lg'>$1</h3>")
    .replace(/## (.*?)$/g, "<h3 class='text-purple-600 font-semibold mt-4 mb-2 text-lg'>$1</h3>")
    .replace(/\*\*(.*?)\*\*/g, "<strong class='font-semibold'>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em class='italic'>$1</em>")
    .replace(
      /`(.*?)`/g,
      "<code class='bg-gray-100 px-1 py-0.5 rounded text-sm font-mono'>$1</code>"
    );

  processedText = processedText.replace(/__JSON_BLOCK_(\d+)__/g, (match, index) => {
    return jsonBlocks[index];
  });

  return processedText;
}

// Analysis functions
const analysisSchema = {
  type: "OBJECT",
  properties: {
    analysis: { type: "STRING" },
    suggestions: { type: "ARRAY", items: { type: "STRING" } },
    recommendedQuestions: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          type: { type: "STRING" },
          passage: { type: "STRING" },
          question: { type: "STRING" },
          options: { type: "ARRAY", items: { type: "STRING" } },
          answer: { type: "STRING" },
        },
        required: ["type", "question", "options", "answer"],
      },
    },
  },
  required: ["analysis", "suggestions", "recommendedQuestions"],
};

let analysisFollowUpInstruction =
  "Anda adalah tutor TOEFL ahli. Berbicaralah dalam Bahasa Indonesia. Bantu siswa memahami analisa tes mereka, berikan saran belajar, dan jika diminta soal latihan baru, berikan dalam format JSON di dalam format :";

analysisFollowUpInstruction += `
  FORMAT WAJIB:
  1. type: HARUS 'structure', 'expression', 'reading', 'listening', 'writing', atau 'grammar'
  2. passage: HANYA untuk reading/listening (jika tidak ada, gunakan "")
  3. question: Untuk structure harus ada '______', untuk expression gunakan <u>teks (A)</u> format
  4. options: 4 pilihan ["(A)...", "(B)..."] untuk structure/expression/reading/listening/grammar
  5. answer: A, B, C, atau D (atau "" untuk writing/speaking)
  6. Semua dalam Bahasa Inggris kecuali instruksi khusus`;

async function getTestAnalysis() {
  analysis.isLoading = true;

  let prompt = `Analisa performa TOEFL siswa:\nSkor: ${props.score}/${props.totalQuestions} (${percentage.value}%)\nWaktu: ${formattedTime.value}\n\n`;

  if (props.incorrectQuestions.length === 0) {
    prompt += "Siswa mendapatkan nilai sempurna! Berikan apresiasi dan saran untuk level lanjutan.";
  } else {
    prompt += "Soal yang perlu perbaikan:\n";
    props.incorrectQuestions.forEach((item, index) => {
      prompt += `\n${index + 1}. [${item.type}] ${item.question.substring(0, 100)}...`;
    });
  }

  prompt += `\n\nBerdasarkan ini, berikan:\n1. Analisa mendalam kelemahan siswa\n2. 3-5 saran perbaikan spesifik\n3. ${recomCount.value} soal latihan baru yang menargetkan kelemahan tersebut\n\nFormat JSON dengan properti:`;
  prompt += `
  FORMAT WAJIB:
  1. type: HARUS 'structure', 'expression', 'reading', 'listening', 'writing', atau 'grammar'
  2. passage: HANYA untuk reading/listening (jika tidak ada, gunakan "")
  3. question: Untuk structure harus ada '______', untuk expression gunakan <u>teks (A)</u> format
  4. options: 4 pilihan ["(A)...", "(B)..."] untuk structure/expression/reading/listening/grammar
  5. answer: A, B, C, atau D (atau "" untuk writing/speaking)
  6. Semua dalam Bahasa Inggris kecuali instruksi khusus`;
  try {
    const jsonString = await callGemini(prompt, analysisSchema);
    if (!jsonString) throw new Error("AI tidak merespons.");

    const data = JSON.parse(jsonString);
    analysis.content = data;
    analysis.jsonString = JSON.stringify(data.recommendedQuestions || [], null, 2);

    const initialAnalysisText = data.analysis || "Berikut analisa performa Anda:";
    analysis.chatHistory = [{ role: "model", parts: [{ text: initialAnalysisText }] }];
    analysis.rawHistoryForPDF = [
      { role: "user", parts: [{ text: prompt }] },
      { role: "model", parts: [{ text: jsonString }] },
    ];
  } catch (error) {
    console.error("Analisa error:", error);
    const errorMsg = `Maaf, terjadi error: ${error.message}`;
    analysis.content = { analysis: errorMsg, suggestions: [], recommendedQuestions: [] };
    analysis.chatHistory = [{ role: "model", parts: [{ text: errorMsg }] }];
  } finally {
    analysis.isLoading = false;
  }
}

async function scrollToBottom() {
  await nextTick();
  if (chatContentRef.value) {
    chatContentRef.value.scrollTop = chatContentRef.value.scrollHeight;
  }
}

async function handleAnalysisFollowUp() {
  const userText = analysis.followUpInput.trim();
  if (!userText || analysis.isLoading) return;

  analysis.isLoading = true;
  analysis.chatHistory.push({ role: "user", parts: [{ text: userText }] });
  analysis.rawHistoryForPDF.push({ role: "user", parts: [{ text: userText }] });
  analysis.followUpInput = "";
  await scrollToBottom();

  const aiResponse = await callGemini(analysis.rawHistoryForPDF, null, analysisFollowUpInstruction);
  const modelResponse = aiResponse || "Maaf, terjadi kesalahan.";

  analysis.chatHistory.push({ role: "model", parts: [{ text: modelResponse }] });
  analysis.rawHistoryForPDF.push({ role: "model", parts: [{ text: modelResponse }] });

  analysis.isLoading = false;
  await scrollToBottom();
}

function copyJson() {
  try {
    navigator.clipboard.writeText(analysis.jsonString).then(() => {
      copyStatus.value = "✅ JSON disalin!";
      setTimeout(() => (copyStatus.value = ""), 3000);
    });
  } catch (err) {
    const textArea = document.createElement("textarea");
    textArea.value = analysis.jsonString;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    copyStatus.value = "✅ JSON disalin!";
    setTimeout(() => (copyStatus.value = ""), 3000);
  }
}

function downloadAnalysisAsPDF() {
  try {
    const doc = new jsPDF();
    let y = 15;
    const margin = 10;
    const maxWidth = doc.internal.pageSize.getWidth() - margin * 2;

    doc.setFontSize(20);
    doc.text("LAPORAN ANALISA TOEFL", doc.internal.pageSize.getWidth() / 2, y, { align: "center" });
    y += 15;

    doc.setFontSize(12);
    analysis.rawHistoryForPDF.forEach((message) => {
      let text = message.parts[0].text;

      if (message.role === "user" && text.includes("Berdasarkan ini")) return;

      if (message.role === "user") {
        doc.setFont("helvetica", "bold");
        text = `Anda: ${text}`;
      } else {
        doc.setFont("helvetica", "normal");
        try {
          const jsonData = JSON.parse(text);
          if (jsonData.analysis) {
            text = `AI:\n${jsonData.analysis}\n\nSaran: ${jsonData.suggestions.join(", ")}`;
          }
        } catch (e) {
          text = `AI: ${text}`;
        }
      }

      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach((line) => {
        if (y > 280) {
          doc.addPage();
          y = 15;
        }
        doc.text(line, margin, y);
        y += 7;
      });
      y += 5;
    });

    doc.save("Analisa_TOEFL.pdf");
  } catch (e) {
    alert("Error membuat PDF. Pastikan library jsPDF terload.");
  }
}
</script>
