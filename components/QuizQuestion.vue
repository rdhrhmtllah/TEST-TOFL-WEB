<template>
  <div
    class="card hover:shadow-2xl transition-all duration-500"
    :class="{ 'ring-2 ring-blue-500': isCurrent }"
  >
    <!-- Question Header -->
    <div class="flex items-start justify-between mb-6">
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg"
        >
          <span class="text-white font-bold text-sm">{{ questionNumber }}</span>
        </div>
        <div>
          <span
            class="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full uppercase"
          >
            {{ question.type }}
          </span>
          <div class="text-sm text-gray-500 mt-1">Poin: 1</div>
        </div>
      </div>

      <div class="flex items-center gap-2" v-if="isSubmitted">
        <div
          class="w-3 h-3 rounded-full"
          :class="feedback.isCorrect ? 'bg-green-500' : 'bg-red-500'"
        ></div>
        <span
          class="text-sm font-semibold"
          :class="feedback.isCorrect ? 'text-green-600' : 'text-red-600'"
        >
          {{ feedback.isCorrect ? "Benar" : "Salah" }}
        </span>
      </div>
    </div>

    <!-- Passage (for reading/listening) -->
    <div
      v-if="question.passage && !question.type === 'reading'"
      class="reading-passage mb-6 transform hover:scale-[1.01] transition-transform duration-300"
    >
      <div class="flex items-center gap-2 mb-3">
        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <span class="text-sm font-semibold text-blue-600">Teks Bacaan</span>
      </div>
      <div class="text-gray-700 leading-relaxed">{{ question.passage }}</div>
    </div>

    <!-- Audio Player -->
    <AudioPlayer
      v-if="question.type === 'listening' && question.passage"
      :script="question.passage"
      lang="en-US"
      voice-name="Zira"
      class="mb-6"
    />

    <!-- Question Text -->
    <p
      :class="[
        'text-lg font-medium text-gray-900 mb-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-blue-100',
        { 'expression-question': question.type === 'expression' },
      ]"
    >
      <span v-html="formattedQuestion"></span>
    </p>

    <!-- Options -->
    <div class="space-y-3 mb-6">
      <label
        v-for="(option, index) in question.options"
        :key="index"
        :class="[
          'flex items-center p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer group',
          isSubmitted ? 'cursor-not-allowed' : 'option-label hover:border-blue-300 hover:shadow-md',
          isSubmitted && getFeedbackClass(optionValue(option)),
          modelValue === optionValue(option) && !isSubmitted
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 bg-white',
        ]"
      >
        <div class="flex items-center w-full">
          <div
            class="w-8 h-8 rounded-lg border-2 flex items-center justify-center mr-4 font-semibold transition-all duration-300 group-hover:scale-110"
            :class="getOptionStyle(optionValue(option))"
          >
            {{ optionValue(option) }}
          </div>

          <input
            type="radio"
            :name="`q${questionNumber}`"
            :value="optionValue(option)"
            :checked="modelValue === optionValue(option)"
            @change="$emit('update:modelValue', $event.target.value)"
            :disabled="isSubmitted"
            class="sr-only"
          />

          <span class="text-gray-700 flex-1" v-html="formattedOption(option)"></span>

          <div v-if="isSubmitted && optionValue(option) === question.answer" class="ml-2">
            <svg
              class="w-5 h-5 text-green-500"
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
        </div>
      </label>
    </div>

    <!-- Feedback -->
    <div
      v-if="isSubmitted"
      :class="[
        'p-4 rounded-2xl text-base font-semibold mb-6 transform transition-all duration-500',
        feedback.isCorrect ? 'correct-answer-bg' : 'incorrect-answer-bg',
      ]"
    >
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-xl flex items-center justify-center text-white"
          :class="feedback.isCorrect ? 'bg-green-500' : 'bg-red-500'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              v-if="feedback.isCorrect"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <div>
          <strong>{{ feedback.text }}</strong>
          <div v-if="!feedback.isCorrect" class="text-sm font-normal mt-1 opacity-90">
            Jawaban benar: <span class="font-semibold">({{ question.answer }})</span>
          </div>
        </div>
      </div>
    </div>

    <!-- AI Explanation -->
    <div v-if="isSubmitted" class="border-t pt-6 border-gray-200">
      <button
        @click="getAIExplanation"
        :disabled="ai.isLoading"
        class="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:transform-none"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span v-if="!ai.isLoading">Dapatkan Penjelasan AI</span>
        <span v-else>Memuat Penjelasan...</span>
        <div v-if="ai.isLoading" class="loader !w-5 !h-5 !border-2"></div>
      </button>

      <!-- Chat History -->
      <div v-if="ai.chatHistory.length > 0" class="mt-6 space-y-4">
        <div class="ai-explanation-content" ref="chatContentRef">
          <div
            v-for="(message, index) in ai.chatHistory"
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
        <!-- Di bagian AI Explanation, perbaiki input section: -->
        <div class="mt-3 pt-3 border-t border-blue-200">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Ada pertanyaan lanjutan?
          </label>
          <div class="flex gap-2 flex-col sm:flex-row">
            <input
              type="text"
              v-model="ai.followUpInput"
              @keydown.enter.prevent="handleFollowUp"
              class="flex-1 p-2 border border-gray-300 rounded-lg text-sm w-full"
              placeholder="Tanya AI..."
              :disabled="ai.isLoading"
            />
            <button
              type="button"
              @click="handleFollowUp"
              class="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm w-full sm:w-auto"
              :disabled="ai.isLoading || !ai.followUpInput"
            >
              Tanya
            </button>
          </div>
          <div v-if="ai.isLoading" class="loader ml-1 my-3 !w-5 !h-5"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, nextTick } from "vue";
import { callGemini } from "../services/gemini.js";
import AudioPlayer from "./AudioPlayer.vue";

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
    type: String,
    default: null,
  },
  isCurrent: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["update:modelValue"]);

const chatContentRef = ref(null);
const ai = reactive({
  isLoading: false,
  chatHistory: [],
  followUpInput: "",
});

// Formatting functions
const formattedQuestion = computed(() => {
  if (props.question.type === "expression") {
    return props.question.question.replace(/<u>\s*(.*?)\s*\(([A-D])\)\s*<\/u>/g, "<u>$1 ($2)</u>");
  }
  return props.question.question;
});

function optionValue(option) {
  return option.match(/\(([A-D])\)/)?.[1] || "";
}

function formattedOption(option) {
  if (["structure", "reading", "listening"].includes(props.question.type)) {
    const value = optionValue(option);
    const text = option.substring(option.indexOf(")") + 1).trim();
    return `<span class="font-semibold">(${value})</span> ${text}`;
  }
  return `<span class="font-semibold">${option}</span>`;
}

function getOptionStyle(optionValue) {
  if (!props.isSubmitted) {
    return props.modelValue === optionValue
      ? "bg-blue-500 text-white border-blue-500"
      : "bg-white text-gray-600 border-gray-300 group-hover:border-blue-300";
  }

  if (optionValue === props.question.answer) {
    return "bg-green-500 text-white border-green-500";
  }
  if (optionValue === props.modelValue) {
    return "bg-red-500 text-white border-red-500";
  }
  return "bg-gray-100 text-gray-400 border-gray-200";
}

// Feedback system
const feedback = computed(() => {
  if (!props.isSubmitted) return { isCorrect: false, text: "" };

  if (props.modelValue === props.question.answer) {
    return { isCorrect: true, text: `Jawaban Anda benar!` };
  } else if (props.modelValue === null) {
    return {
      isCorrect: false,
      text: `Anda tidak menjawab soal ini.`,
    };
  } else {
    return {
      isCorrect: false,
      text: `Jawaban Anda belum tepat.`,
    };
  }
});

function getFeedbackClass(option) {
  if (option === props.question.answer) {
    return "!border-green-500 bg-green-50";
  }
  if (option === props.modelValue) {
    return "!border-red-500 bg-red-50";
  }
  return "border-gray-200";
}

// AI Explanation functions
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

  let prompt = `Sebagai tutor TOEFL ahli, jelaskan soal berikut dalam Bahasa Indonesia:\n\n`;
  if (props.question.passage) {
    prompt += `Konteks: ${props.question.passage}\n\n`;
  }
  prompt += `Soal: ${formattedQuestion.value.replace(/<\/?u>/g, "")}\n\n`;

  if (type === "structure" || type === "reading" || type === "listening") {
    prompt += `Pilihan:\n${options.join("\n")}\n\n`;
    prompt += `Jawaban Benar: ${correctAnswerText}\n\n`;
    prompt += `Berikan penjelasan mengapa "${correctAnswerText}" benar dan analisis kesalahan pilihan lain.`;
  } else if (type === "expression") {
    prompt += `Jawaban Benar (Error): ${correctAnswerText}\n\n`;
    prompt += `Jelaskan kesalahan gramatikal dan berikan koreksi yang tepat.`;
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
  if (ai.chatHistory.length > 0) return;

  ai.isLoading = true;
  const prompt = createAIPrompt();
  const explanation = await callGemini(prompt);

  ai.chatHistory = [
    {
      role: "model",
      parts: [{ text: explanation || "Gagal memuat penjelasan. Silakan coba lagi." }],
    },
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
  const modelResponse = aiResponse || "Maaf, terjadi kesalahan. Silakan coba lagi.";
  ai.chatHistory.push({ role: "model", parts: [{ text: modelResponse }] });

  ai.isLoading = false;
  await scrollToBottom();
}

// Markdown renderer
function renderMarkdown(text) {
  if (!text) return "";

  let jsonBlocks = [];
  let processedText = text.replace(/```json([\s\S]*?)```/gs, (match, json) => {
    jsonBlocks.push(
      `<pre class="bg-gray-900 text-white p-3 rounded-lg my-2 overflow-x-auto">${json
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .trim()}</pre>`
    );
    return `__JSON_BLOCK_${jsonBlocks.length - 1}__`;
  });

  processedText = processedText
    .replace(/\n/g, "<br>")
    .replace(/## (.*?)<br>/g, "<h3 class='text-blue-600 font-semibold mt-3 mb-2'>$1</h3>")
    .replace(/## (.*?)$/g, "<h3 class='text-blue-600 font-semibold mt-3 mb-2'>$1</h3>")
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
</script>
