<template>
  <div class="white p-6 rounded-2xl shadow-lg mb-6">
    <h3 class="text-xl font-bold mb-4">Impor / Ekspor Data Soal</h3>
    <p class="text-gray-600 mb-2">
      Tempel (paste) data soal dalam format JSON di bawah ini dan tekan "Muat Soal".
    </p>
    <textarea
      v-model="jsonData"
      class="w-full h-48 p-3 border border-gray-300 rounded-lg font-mono text-sm"
      placeholder="Paste JSON data di sini..."
    ></textarea>
    <div class="flex gap-4 mt-4 flex-wrap">
      <button
        @click="loadQuestions"
        class="blue-600 text-white font-bold py-2 px-6 rounded-lg hover:blue-700 transition duration-300"
      >
        Muat Soal
      </button>
      <button
        @click="exportDefaultQuestions"
        class="gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:gray-300 transition duration-300"
      >
        Ekspor Soal Default
      </button>
      <button @click="$emit('back')" class="text-gray-600 hover:text-blue-600 ml-auto">
        &larr; Kembali
      </button>
    </div>
    <p :class="['text-sm mt-3', status.isError ? 'text-red-600' : 'text-green-600']">
      {{ status.message }}
    </p>
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
const status = reactive({
  message: "",
  isError: false,
});

function loadQuestions() {
  try {
    const newData = JSON.parse(jsonData.value);
    if (!Array.isArray(newData)) {
      throw new Error("Data harus berupa array.");
    }
    status.message = `Berhasil memuat ${newData.length} soal baru!`;
    status.isError = false;
    emit("questions-loaded", newData);
  } catch (error) {
    console.error("Gagal memuat JSON:", error);
    status.message = `Gagal memuat: ${error.message}`;
    status.isError = true;
  }
}

function exportDefaultQuestions() {
  jsonData.value = JSON.stringify(props.defaultData, null, 2);
  status.message = "Data soal default telah diekspor ke area teks.";
  status.isError = false;
}
</script>
