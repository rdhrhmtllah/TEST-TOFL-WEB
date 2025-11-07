<template>
  <div class="card max-w-4xl mx-auto">
    <div class="text-center mb-8">
      <div
        class="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg"
      >
        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
          />
        </svg>
      </div>
      <h1
        class="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-3"
      >
        Impor & Ekspor Soal
      </h1>
      <p class="text-gray-600">Kelola data soal TOEFL Anda dengan format JSON</p>
    </div>

    <div class="grid md:grid-cols-2 gap-8">
      <!-- Import Section -->
      <div class="space-y-4">
        <h3 class="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
            />
          </svg>
          Impor Soal
        </h3>

        <div class="relative">
          <textarea
            v-model="jsonData"
            class="w-full h-64 p-4 border-2 border-gray-200 rounded-2xl font-mono text-sm focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all duration-300 resize-none scrollbar-thin"
            placeholder="Tempel data JSON soal di sini..."
            @dragover="dragover"
            @drop="drop"
          ></textarea>
          <div
            v-if="isDragging"
            class="absolute inset-0 bg-green-500/10 border-2 border-dashed border-green-500 rounded-2xl flex items-center justify-center"
          >
            <span class="text-green-600 font-semibold">Lepaskan file JSON di sini</span>
          </div>
        </div>

        <div class="flex gap-3 flex-wrap">
          <button
            @click="loadQuestions"
            class="btn-primary flex-1 min-w-[120px] text-center"
            :class="{ 'bg-green-500 hover:bg-green-600': !status.isError }"
          >
            📥 Muat Soal
          </button>

          <label class="btn-secondary flex-1 min-w-[120px] text-center cursor-pointer">
            <input type="file" @change="handleFileUpload" accept=".json" class="hidden" />
            📁 Pilih File
          </label>
        </div>
      </div>

      <!-- Export Section -->
      <div class="space-y-4">
        <h3 class="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Ekspor Soal
        </h3>

        <div
          class="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-dashed border-blue-200"
        >
          <p class="text-sm text-gray-600 mb-3">Ekspor soal default atau data yang sedang dimuat</p>

          <div class="space-y-3">
            <button
              @click="exportDefaultQuestions"
              class="w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 px-4 rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 text-left flex items-center gap-3"
            >
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  class="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <div class="font-semibold">Soal Default</div>
                <div class="text-xs text-gray-500">{{ defaultData.length }} soal tersedia</div>
              </div>
            </button>

            <button
              @click="downloadJSON"
              class="w-full bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 px-4 rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 text-left flex items-center gap-3"
            >
              <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg
                  class="w-4 h-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <div class="font-semibold">Download JSON</div>
                <div class="text-xs text-gray-500">Simpan ke file</div>
              </div>
            </button>
          </div>
        </div>

        <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-2xl">
          <h4 class="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            Format JSON yang Valid
          </h4>
          <p class="text-sm text-yellow-700">
            Pastikan JSON memiliki array soal dengan properti: type, question, options, answer
          </p>
        </div>
      </div>
    </div>

    <!-- Status Message -->
    <div
      v-if="status.message"
      :class="[
        'p-4 rounded-2xl mt-6 text-center font-semibold transition-all duration-300',
        status.isError
          ? 'bg-red-50 border border-red-200 text-red-700'
          : 'bg-green-50 border border-green-200 text-green-700',
      ]"
    >
      {{ status.message }}
    </div>

    <!-- Back Button -->
    <button
      @click="$emit('back')"
      class="btn-secondary w-full mt-6 text-center flex items-center justify-center gap-2"
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
</template>

<script setup>
import { ref, reactive } from "vue";

const props = defineProps({
  defaultData: {
    type: Array,
    required: true,
  },
});
const emit = defineEmits(["back", "questions-loaded"]);

const jsonData = ref("");
const isDragging = ref(false);
const status = reactive({
  message: "",
  isError: false,
});

function loadQuestions() {
  try {
    if (!jsonData.value.trim()) {
      throw new Error("Data JSON tidak boleh kosong.");
    }

    const newData = JSON.parse(jsonData.value);
    if (!Array.isArray(newData)) {
      throw new Error("Data harus berupa array.");
    }

    // Validasi struktur data
    const isValid = newData.every(
      (item) => item.type && item.question && Array.isArray(item.options) && item.answer
    );

    if (!isValid) {
      throw new Error(
        "Format soal tidak valid. Pastikan setiap soal memiliki type, question, options, dan answer."
      );
    }

    status.message = `✅ Berhasil memuat ${newData.length} soal!`;
    status.isError = false;

    // Auto clear status setelah 3 detik
    setTimeout(() => {
      status.message = "";
    }, 3000);

    emit("questions-loaded", newData);
  } catch (error) {
    console.error("Gagal memuat JSON:", error);
    status.message = `❌ ${error.message}`;
    status.isError = true;
  }
}

function exportDefaultQuestions() {
  jsonData.value = JSON.stringify(props.defaultData, null, 2);
  status.message = "📋 Data soal default telah diekspor ke area teks.";
  status.isError = false;
}

function downloadJSON() {
  const dataStr = jsonData.value || JSON.stringify(props.defaultData, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "toefl-questions.json";
  link.click();
  URL.revokeObjectURL(url);

  status.message = "💾 File JSON berhasil diunduh!";
  status.isError = false;
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file && file.type === "application/json") {
    const reader = new FileReader();
    reader.onload = (e) => {
      jsonData.value = e.target.result;
      status.message = "📁 File berhasil dimuat!";
      status.isError = false;
    };
    reader.readAsText(file);
  } else {
    status.message = "❌ Harap pilih file JSON yang valid.";
    status.isError = true;
  }
  event.target.value = "";
}

function dragover(event) {
  event.preventDefault();
  isDragging.value = true;
}

function drop(event) {
  event.preventDefault();
  isDragging.value = false;

  const file = event.dataTransfer.files[0];
  if (file && file.type === "application/json") {
    handleFileUpload({ target: { files: [file] } });
  } else {
    status.message = "❌ Harap drop file JSON yang valid.";
    status.isError = true;
  }
}
</script>
