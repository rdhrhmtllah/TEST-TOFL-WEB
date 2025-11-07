<template>
  <div class="mb-8 p-5 border border-gray-200 rounded-xl">
    <p
      :class="[
        'text-lg font-medium text-gray-900 mb-4',
        { 'expression-question': question.type === 'expression' },
      ]"
    >
      <span class="font-bold">{{ questionNumber }}.</span>
      <span v-html="formattedQuestion"></span>
    </p>

    <!-- Pilihan Jawaban -->
    <div class="space-y-3">
      <label
        v-for="(option, index) in question.options"
        :key="index"
        :class="[
          'flex items-center p-3 rounded-lg transition duration-200',
          isSubmitted ? 'cursor-not-allowed' : 'cursor-pointer option-label',
          isSubmitted && getFeedbackClass(optionValue(option)),
        ]"
      >
        <input
          type="radio"
          :name="`q${questionNumber}`"
          :value="optionValue(option)"
          :checked="modelValue === optionValue(option)"
          @change="$emit('update:modelValue', $event.target.value)"
          :disabled="isSubmitted"
          class="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
        />
        <span class="text-gray-700" v-html="formattedOption(option)"></span>
      </label>
    </div>

    <!-- Umpan Balik setelah Submit -->
    <div
      v-if="isSubmitted"
      :class="[
        'mt-4 p-4 rounded-lg text-base font-medium',
        feedback.isCorrect
          ? 'correct-answer-bg text-green-700'
          : 'incorrect-answer-bg text-red-700',
      ]"
    >
      <strong>{{ feedback.text }}</strong>
    </div>

    <!-- Penjelasan AI -->
    <div v-if="isSubmitted" class="mt-4">
      <button
        @click="getAIExplanation"
        :disabled="ai.isLoading"
        class="gray-800 text-white font-semibold py-2 px-5 rounded-lg hover:gray-700 transition duration-300 text-sm disabled:opacity-50 flex items-center gap-2"
      >
        <span v-if="!ai.isLoading">Dapatkan Penjelasan (AI)</span>
        <div v-if="ai.isLoading" class="loader !w-4 !h-4 !border-2"></div>
      </button>

      <div v-if="ai.chatHistory.length > 0" class="mt-3">
        <div class="ai-explanation-content" ref="chatContentRef">
          <div
            v-for="(message, index) in ai.chatHistory"
            :key="index"
            :class="['ai-chat-bubble', message.role]"
          >
            <strong>{{ message.role === "user" ? "Anda:" : "AI:" }}</strong>
            <div v-html="renderMarkdown(message.parts[0].text)"></div>
            <div class="clearfix" style="clear: both"></div>
          </div>
        </div>

        <!-- Input Chat Lanjutan -->
        <div class="mt-3 pt-3 border-t border-blue-200">
          <label
            :for="`followup-input-${questionNumber}`"
            class="block text-sm font-medium text-gray-700"
            >Ada pertanyaan lanjutan?</label
          >
          <div class="flex gap-2 mt-1">
            <input
              type="text"
              v-model="ai.followUpInput"
              :id="`followup-input-${questionNumber}`"
              @keydown.enter.prevent="handleFollowUp"
              class="flex-1 p-2 border border-gray-300 rounded-lg"
              placeholder="Tanya AI..."
              :disabled="ai.isLoading"
            />
            <button
              type="button"
              @click="handleFollowUp"
              :id="`followup-btn-${questionNumber}`"
              class="blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:blue-700 flex-shrink-0 disabled:opacity-50"
              :disabled="ai.isLoading || !ai.followUpInput"
            >
              Tanya
            </button>
          </div>
          <div
            v-if="ai.isLoading && ai.chatHistory.length > 0"
            class="loader ml-1 my-3 !w-5 !h-5"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, nextTick } from "vue";
import { callGemini } from "../services/gemini.js";

const props = defineProps({
  question: {
    type: Object,
    required: true,
  },
  questionNumber: {
    type: Number,
    required: true,
  },
  isSubmitted: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    // v-model
    type: String,
    default: null,
  },
});
defineEmits(["update:modelValue"]);

const chatContentRef = ref(null);
const ai = reactive({
  isLoading: false,
  chatHistory: [],
  followUpInput: "",
});

// --- Formatting ---
const formattedQuestion = computed(() => {
  if (props.question.type === "expression") {
    // Regex untuk mengganti <u>teks (X)</u> dengan format yang benar
    return props.question.question.replace(/<u>\s*(.*?)\s*\(([A-D])\)\s*<\/u>/g, "<u>$1 ($2)</u>");
  }
  return props.question.question;
});

function optionValue(option) {
  return option.match(/\(([A-D])\)/)?.[1] || "";
}

function formattedOption(option) {
  if (
    props.question.type === "structure" ||
    props.question.type === "reading" ||
    props.question.type === "listening"
  ) {
    const value = optionValue(option);
    const text = option.substring(option.indexOf(")") + 1).trim();
    return `<span class="font-semibold">(${value})</span> ${text}`;
  }
  return `<span class="font-semibold">${option}</span>`; // Untuk expression
}

// --- Feedback ---
const feedback = computed(() => {
  if (!props.isSubmitted) return { isCorrect: false, text: "" };

  if (props.modelValue === props.question.answer) {
    return { isCorrect: true, text: `Benar! Jawaban Anda (${props.question.answer}).` };
  } else if (props.modelValue === null) {
    return {
      isCorrect: false,
      text: `Tidak Dijawab. Jawaban yang benar adalah (${props.question.answer}).`,
    };
  } else {
    return {
      isCorrect: false,
      text: `Salah. Jawaban Anda (${props.modelValue}). Jawaban yang benar adalah (${props.question.answer}).`,
    };
  }
});

function getFeedbackClass(option) {
  if (option === props.question.answer) {
    return "!green-100 !border-green-400";
  }
  if (option === props.modelValue) {
    return "!red-100 !border-red-400";
  }
  return "border-transparent";
}

// --- AI Explanation ---
function createAIPrompt() {
  const { question, options, answer, type } = props.question;
  let correctAnswerText = `(${answer})`;

  if (type === "structure" || type === "reading" || type === "listening") {
    correctAnswerText = options.find((opt) => opt.startsWith(`(${answer})`)) || `(${answer})`;
  } else if (type === "expression") {
    const match = formattedQuestion.value.match(new RegExp(`<u>(.*?) \\(${answer}\\)</u>`));
    if (match && match[1]) {
      correctAnswerText = `(${answer}) ${match[1].trim()}`;
    }
  }

  let prompt = `Tolong jelaskan tata bahasa (grammar) atau alasan untuk soal TOEFL berikut dalam Bahasa Indonesia.\n\n`;
  if (props.question.passage) {
    prompt += `Konteks/Naskah: ${props.question.passage.substring(0, 100)}...\n\n`;
  }
  prompt += `Soal:\n${formattedQuestion.value.replace(/<\/?u>/g, "")}\n\n`;

  if (type === "structure" || type === "reading" || type === "listening") {
    prompt += `Pilihan Jawaban:\n${options.join("\n")}\n\n`;
    prompt += `Jawaban yang Benar: ${correctAnswerText}\n\n`;
    prompt += `Mengapa jawaban "${correctAnswerText}" benar? Dan mengapa pilihan lainnya salah?`;
  } else if (type === "expression") {
    prompt += `Jawaban yang Benar (Error): ${correctAnswerText}\n\n`;
    prompt += `Mengapa bagian "${correctAnswerText}" salah secara tata bahasa? Apa seharusnya perbaikannya?`;
  }
  return prompt;
}

async function scrollToBottom() {
  await nextTick();
  if (chatContentRef.value) {
    chatContentRef.value.scrollTop = chatContentRef.value.scrollHeight;
  }
}

async function getAIExplanation() {
  if (ai.chatHistory.length > 0) return; // Sudah di-load

  ai.isLoading = true;
  const prompt = createAIPrompt();
  const explanation = await callGemini(prompt);

  ai.chatHistory = [
    // { role: "user", parts: [{ text: prompt }] }, // Sembunyikan prompt awal
    { role: "model", parts: [{ text: explanation || "Gagal memuat penjelasan." }] },
  ];
  ai.isLoading = false;
  await scrollToBottom();
}

async function handleFollowUp() {
  const userText = ai.followUpInput.trim();
  if (!userText || ai.isLoading) return;

  ai.isLoading = true;
  ai.chatHistory.push({ role: "user", parts: [{ text: userText }] });
  ai.followUpInput = "";
  await scrollToBottom();

  const aiResponse = await callGemini(ai.chatHistory);
  const modelResponse = aiResponse || "Maaf, saya gagal merespon. Silakan coba lagi.";
  ai.chatHistory.push({ role: "model", parts: [{ text: modelResponse }] });

  ai.isLoading = false;
  await scrollToBottom();
}

// --- Markdown Renderer ---
function renderMarkdown(text) {
  if (!text) return "";

  let jsonBlocks = [];
  let processedText = text.replace(/```json([\s\S]*?)```/gs, (match, json) => {
    jsonBlocks.push(`<pre>${json.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim()}</pre>`);
    return `__JSON_BLOCK_${jsonBlocks.length - 1}__`;
  });

  processedText = processedText
    .replace(/\n/g, "<br>")
    .replace(/## (.*?)<br>/g, "<h3>$1</h3>")
    .replace(/## (.*?)$/g, "<h3>$1</h3>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code>$1</code>");

  processedText = processedText.replace(/__JSON_BLOCK_(\d+)__/g, (match, index) => {
    return jsonBlocks[index];
  });

  return processedText;
}
</script>
