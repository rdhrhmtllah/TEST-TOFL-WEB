<template>
  <div class="space-y-8">
    <div class="bg-white p-6 rounded-2xl shadow-lg text-center">
      <h2 class="text-3xl font-bold text-green-600">Tes Selesai!</h2>
      <p class="text-xl text-gray-700 mt-2">Skor Anda: {{ score }} / {{ totalQuestions }}</p>
      <p class="text-4xl font-bold text-blue-700 mt-2">Nilai: {{ percentage }}</p>
      <p class="text-xl text-gray-700 mt-2">Waktu Pengerjaan: {{ formattedTime }}</p>
      <button
        @click="$emit('reset')"
        class="mt-6 bg-red-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700 transition duration-300"
      >
        Reset Tes
      </button>
    </div>

    <div class="bg-white p-6 md:p-10 rounded-2xl shadow-lg">
      <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">Analisa Tes Anda</h2>
      <p class="text-center text-gray-600 mb-6">
        Dapatkan umpan balik mendalam dari AI mengenai performa Anda, kelemahan, dan rekomendasi
        soal latihan.
      </p>

      <div v-if="!analysis.content">
        <div class="max-w-md mx-auto mb-4">
          <label for="recom-q-count" class="block text-lg font-medium text-gray-700 mb-2"
            >Jumlah Soal Rekomendasi:</label
          >
          <input
            type="number"
            v-model.number="recomCount"
            id="recom-q-count"
            class="w-full p-3 border border-gray-300 rounded-lg text-lg"
            min="1"
            max="50"
          />
        </div>
        <button
          @click="getTestAnalysis"
          :disabled="analysis.isLoading"
          class="w-full bg-gray-800 text-white font-bold py-3 px-10 rounded-lg shadow-md hover:bg-gray-700 transition duration-300 text-xl flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <span v-if="!analysis.isLoading">Dapatkan Analisa & Rekomendasi (AI)</span>
          <div v-if="analysis.isLoading" class="loader"></div>
        </button>
      </div>

      <div v-if="analysis.isLoading && !analysis.content" class="loader mx-auto my-6"></div>

      <div v-if="analysis.content" class="mt-6 space-y-6">
        <div>
          <h3 class="text-xl font-bold text-blue-700 mb-3 border-b pb-2">Analisa Kemampuan</h3>
          <p class="text-gray-700 whitespace-pre-wrap">{{ analysis.content.analysis }}</p>
        </div>
        <div>
          <h3 class="text-xl font-bold text-blue-700 mb-3 border-b pb-2">Saran Perbaikan</h3>
          <ul class="list-disc list-inside space-y-2 text-gray-700">
            <li v-for="(suggestion, index) in analysis.content.suggestions" :key="index">
              {{ suggestion }}
            </li>
          </ul>
        </div>
        <div>
          <h3 class="text-xl font-bold text-blue-700 mb-3 border-b pb-2">
            Rekomendasi Soal Latihan (JSON)
          </h3>
          <p class="text-sm text-gray-600 mb-3">
            Salin kode JSON di bawah ini dan gunakan fitur "Impor Soal" atau tombol "Latih Soal
            Ini".
          </p>
          <textarea
            :value="analysis.jsonString"
            readonly
            class="w-full h-48 p-3 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50"
          ></textarea>

          <div class="flex gap-3 mt-2 flex-wrap">
            <button
              @click="copyJson"
              class="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition duration-300 text-sm"
            >
              Copy JSON
            </button>
            <button
              @click="$emit('loadRecommended', analysis.content.recommendedQuestions)"
              class="bg-green-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-green-700 transition duration-300 text-sm"
            >
              Latih Soal Rekomendasi Ini
            </button>
          </div>
          <span class="ml-2 text-sm text-green-600">{{ copyStatus }}</span>
        </div>

        <div class="mt-6 pt-6 border-t border-gray-200">
          <div class="flex justify-between items-center mb-3">
            <h3 class="text-xl font-bold text-blue-700">Diskusi Analisa</h3>
            <button
              @click="downloadAnalysisAsPDF"
              class="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-300 text-sm"
            >
              Download Chat as PDF
            </button>
          </div>
          <div class="ai-explanation-content" ref="chatContentRef">
            <div
              v-for="(message, index) in analysis.chatHistory"
              :key="index"
              :class="['ai-chat-bubble', message.role]"
            >
              <strong>{{ message.role === "user" ? "Anda:" : "AI:" }}</strong>
              <div v-html="renderMarkdown(message.parts[0].text)"></div>
              <div class="clearfix" style="clear: both"></div>
            </div>
          </div>
          <div class="mt-3 pt-3 border-t border-blue-200">
            <label for="analysis-followup-input" class="block text-sm font-medium text-gray-700"
              >Ada pertanyaan lanjutan?</label
            >
            <div class="flex gap-2 mt-1">
              <input
                type="text"
                v-model="analysis.followUpInput"
                id="analysis-followup-input"
                @keydown.enter.prevent="handleAnalysisFollowUp"
                class="flex-1 p-2 border border-gray-300 rounded-lg"
                placeholder="Tanya AI tentang analisamu..."
                :disabled="analysis.isLoading"
              />
              <button
                type="button"
                @click="handleAnalysisFollowUp"
                class="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 flex-shrink-0 disabled:opacity-50"
                :disabled="analysis.isLoading || !analysis.followUpInput"
              >
                Tanya
              </button>
            </div>
            <div v-if="analysis.isLoading" class="loader ml-1 my-3 !w-5 !h-5"></div>
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
  chatHistory: [], // Riwayat untuk TAMPILAN (sudah di-renderMarkdown)
  rawHistoryForPDF: [], // Riwayat MENTAH (untuk PDF dan panggilan API)
  followUpInput: "",
});

// Computed properties untuk menampilkan skor (yang dilempar dari App.vue)
const percentage = computed(() => {
  return (props.totalQuestions > 0 ? (props.score / props.totalQuestions) * 100 : 0).toFixed(0);
});

const formattedTime = computed(() => {
  const minutes = Math.floor(props.timeTaken / 60);
  const seconds = props.timeTaken % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
});

// Fungsi untuk merender Markdown (termasuk blok JSON)
function renderMarkdown(text) {
  if (!text) return "";
  let jsonBlocks = [];
  // 1. Ekstrak dan amankan blok JSON
  let processedText = text.replace(/```json([\s\S]*?)```/gs, (match, json) => {
    // Ganti karakter HTML khusus di dalam JSON agar aman di-render
    const safeJson = json.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();
    jsonBlocks.push(`<pre>${safeJson}</pre>`);
    return `__JSON_BLOCK_${jsonBlocks.length - 1}__`;
  });

  // 2. Render Markdown dasar
  processedText = processedText
    .replace(/\n/g, "<br>")
    .replace(/## (.*?)<br>/g, "<h3>$1</h3>")
    .replace(/## (.*?)$/g, "<h3>$1</h3>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code>$1</code>");

  // 3. Kembalikan blok JSON yang sudah di-format
  processedText = processedText.replace(
    /__JSON_BLOCK_(\d+)__/g,
    (match, index) => jsonBlocks[index]
  );
  return processedText;
}

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

// [PERBAIKAN] Instruksi AI sekarang lebih ketat
const analysisFollowUpInstruction =
  "Anda adalah seorang tutor TOEFL ahli. Berbicaralah dalam Bahasa Indonesia. Tugas Anda adalah membantu siswa memahami analisa tes mereka. Anda bisa menjawab pertanyaan, memberikan saran belajar (seperti jadwal), dan jika siswa meminta soal latihan baru, berikan soal-soal tersebut dalam format JSON di dalam blok kode ```json ... ```. PENTING: Format JSON HARUS selalu menyertakan properti berikut: `type` (cth: 'structure'), `passage` (WAJIB ada, gunakan `\"\"` jika tidak ada), `question` (cth: '...'), `options` (array 4 string), dan `answer` (cth: 'A'). Properti `passage` WAJIB ada meskipun kosong (\"\"). JANGAN gunakan tabel atau daftar poin (bullet/numbered list).";

async function getTestAnalysis() {
  analysis.isLoading = true;

  let prompt = `Anda adalah seorang tutor ahli TOEFL. Siswa saya baru saja menyelesaikan tes dengan skor ${props.score} dari ${props.totalQuestions} soal. Berikut adalah daftar soal yang dijawab salah:\n\n`;
  if (props.incorrectQuestions.length === 0) {
    prompt =
      "Siswa saya mendapatkan nilai sempurna. Berikan pujian dan mungkin satu saran lanjutan untuk level berikutnya.";
  } else {
    props.incorrectQuestions.forEach((item, index) => {
      prompt += `--- Soal Salah #${index + 1} (Tipe: ${item.type}) ---\n`;
      if (item.passage) prompt += `Wacana: ${item.passage.substring(0, 100)}...\n`;
      prompt += `Pertanyaan: ${item.question.replace(/<\/?u>/g, "")}\n`;
      prompt += `Jawaban Siswa: ${item.userAnswer}\n`;
      prompt += `Jawaban Benar: ${item.answer}\n\n`;
    });
  }

  // [PERBAIKAN] Menambahkan aturan 'passage' ke prompt awal juga
  prompt += `\nBerdasarkan data di atas, tolong berikan respon dalam format JSON yang diminta:\n1. 'analysis': Analisa mendalam (string) tentang kelemahan utama siswa.\n2. 'suggestions': Array berisi 3-5 poin saran perbaikan.\n3. 'recommendedQuestions': Array berisi ${recomCount.value} soal latihan BARU (JSON lengkap) dalam Bahasa Inggris yang menargetkan kelemahan tersebut. PENTING: Format JSON soal HARUS menyertakan 'type', 'passage' (gunakan \"\" jika kosong), 'question', 'options', dan 'answer'.`;

  try {
    const jsonString = await callGemini(prompt, analysisSchema);
    if (!jsonString) throw new Error("AI tidak memberikan respon JSON.");

    const data = JSON.parse(jsonString);
    analysis.content = data;
    analysis.jsonString = JSON.stringify(data.recommendedQuestions || [], null, 2);

    const initialAnalysisText = data.analysis || "Berikut adalah analisa Anda.";
    // Riwayat untuk TAMPILAN
    analysis.chatHistory = [{ role: "model", parts: [{ text: initialAnalysisText }] }];
    // Riwayat MENTAH (untuk PDF dan API call)
    analysis.rawHistoryForPDF = [
      { role: "user", parts: [{ text: prompt }] }, // Prompt awal
      { role: "model", parts: [{ text: jsonString }] }, // Respon JSON mentah
    ];
  } catch (error) {
    console.error("Gagal mendapatkan analisa:", error);
    const errorMsg = `Maaf, terjadi kesalahan: ${error.message}`;
    analysis.content = { analysis: errorMsg, suggestions: [], recommendedQuestions: [] };
    analysis.chatHistory = [{ role: "model", parts: [{ text: errorMsg }] }];
    analysis.rawHistoryForPDF = [
      { role: "user", parts: [{ text: prompt }] },
      { role: "model", parts: [{ text: errorMsg }] },
    ];
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
  analysis.chatHistory.push({ role: "user", parts: [{ text: userText }] }); // Untuk tampilan
  analysis.rawHistoryForPDF.push({ role: "user", parts: [{ text: userText }] }); // Untuk API & PDF
  analysis.followUpInput = "";
  await scrollToBottom();

  const aiResponse = await callGemini(analysis.rawHistoryForPDF, null, analysisFollowUpInstruction);
  const modelResponse = aiResponse || "Maaf, saya gagal merespon. Silakan coba lagi.";

  analysis.chatHistory.push({ role: "model", parts: [{ text: modelResponse }] }); // Untuk tampilan
  analysis.rawHistoryForPDF.push({ role: "model", parts: [{ text: modelResponse }] }); // Untuk API & PDF

  analysis.isLoading = false;
  await scrollToBottom();
}

function handleAnalysisEnterKey(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    handleAnalysisFollowUp();
  }
}

function copyJson() {
  try {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(analysis.jsonString).then(() => {
        copyStatus.value = "Tersalin!";
        setTimeout(() => {
          copyStatus.value = "";
        }, 2000);
      });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = analysis.jsonString;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      copyStatus.value = "Tersalin!";
      setTimeout(() => {
        copyStatus.value = "";
      }, 2000);
    }
  } catch (err) {
    console.error("Gagal menyalin teks: ", err);
    copyStatus.value = "Gagal menyalin.";
  }
}

// [PERBAIKAN] Fungsi download PDF sekarang membaca riwayat mentah
function downloadAnalysisAsPDF() {
  try {
    // Pastikan jsPDF telah dimuat
    if (typeof jsPDF === "undefined") {
      alert("Gagal memuat library PDF. Coba segarkan halaman.");
      return;
    }
    const doc = new jsPDF();
    let y = 15;
    const margin = 10;
    const maxWidth = doc.internal.pageSize.getWidth() - margin * 2;

    doc.setFontSize(16);
    doc.text("Rekap Diskusi Analisa TOEFL", doc.internal.pageSize.getWidth() / 2, y, {
      align: "center",
    });
    y += 10;
    doc.setFontSize(10);

    // [PERBAIKAN] Gunakan rawHistoryForPDF
    analysis.rawHistoryForPDF.forEach((message) => {
      let text = "";

      // Lewati prompt pengguna awal yang panjang
      if (message.role === "user" && message.parts[0].text.includes("Berdasarkan data di atas")) {
        return;
      }

      if (message.role === "user") {
        doc.setFont("helvetica", "bold");
        text = `Anda: ${message.parts[0].text}`;
      } else {
        // model
        doc.setFont("helvetica", "normal");
        text = message.parts[0].text;

        // Cek apakah ini respon JSON awal
        try {
          const jsonData = JSON.parse(text);
          if (jsonData.analysis && jsonData.recommendedQuestions) {
            // Jika ya, format secara khusus
            text = `AI (Analisa Awal):\n${
              jsonData.analysis
            }\n\n--- Rekomendasi Soal (JSON) ---\n${JSON.stringify(
              jsonData.recommendedQuestions,
              null,
              2
            )}`;
          } else {
            text = `AI: ${text}`;
          }
        } catch (e) {
          // Jika bukan JSON, ini adalah chat biasa
          text = `AI: ${text}`;
        }
      }

      // Pisahkan teks berdasarkan blok JSON
      const parts = text.split(/```json([\s\S]*?)```/gs);

      parts.forEach((part, index) => {
        const isJson = index % 2 !== 0; // Bagian ganjil adalah JSON

        if (isJson) {
          doc.setFont("courier", "normal");
          doc.setFontSize(8); // Font kecil untuk JSON
          part = `\n--- BLOK JSON SOAL LATIHAN ---\n${part.trim()}\n--- AKHIR BLOK JSON ---\n`;
        } else {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
        }

        // Bersihkan sisa markdown
        part = part
          .replace(/\*\*(.*?)\*\*/g, "$1")
          .replace(/\*(.*?)\*/g, "$1")
          .replace(/## (.*?)/g, "$1");

        const lines = doc.splitTextToSize(part, maxWidth);

        lines.forEach((line) => {
          if (y > 280) {
            // Cek batas halaman
            doc.addPage();
            y = 15;
          }
          doc.text(line, margin, y);
          y += isJson ? 5 : 7; // Jarak baris lebih rapat untuk JSON
        });

        if (isJson) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
        }
      });
      y += 5; // Spasi antar bubble
    });

    doc.save("Analisa_TOEFL.pdf");
  } catch (e) {
    console.error("Gagal membuat PDF:", e);
    alert("Gagal membuat PDF. Pastikan library jsPDF berhasil dimuat.");
  }
}
</script>
