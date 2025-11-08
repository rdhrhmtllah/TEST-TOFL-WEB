<template>
  <div class="audio-player group">
    <div class="flex items-center gap-4 flex-1">
      <div class="flex items-center gap-2 min-w-0 flex-1">
        <div class="w-3 h-3 bg-blue-500 rounded-full animate-pulse" v-if="isPlaying"></div>
        <span class="audio-player-label truncate">{{ audioLabel }}</span>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="togglePlay"
          :title="isPlaying ? 'Pause' : 'Play'"
          class="relative overflow-hidden"
        >
          <span class="play-pause-btn-icon" v-html="playIcon"></span>
          <div
            class="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"
          ></div>
        </button>

        <button
          type="button"
          @click="replay"
          title="Replay"
          class="replay-btn relative overflow-hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-arrow-repeat"
            viewBox="0 0 16 16"
          >
            <path
              d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9"
            />
            <path
              fill-rule="evenodd"
              d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z"
            />
          </svg>
          <div
            class="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"
          ></div>
        </button>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="w-full mt-3" v-if="isPlaying">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted, computed } from "vue";

const props = defineProps({
  script: {
    type: String,
    required: true,
  },
});

const utterance = ref(null);
const isPlaying = ref(false);
const isPaused = ref(false);
const progress = ref(0);
const progressInterval = ref(null);

const ICONS = {
  PLAY: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z"/>
</svg>`,
  PAUSE: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.25 5C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5m3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5"/>
</svg>/`,
};

const playIcon = computed(() => (isPlaying.value ? ICONS.PAUSE : ICONS.PLAY));
const audioLabel = computed(() => {
  if (isPlaying.value) return "Memutar audio...";
  if (isPaused.value) return "Audio dijeda";
  return "Klik audio";
});

function startProgress() {
  progress.value = 0;
  clearInterval(progressInterval.value);
  progressInterval.value = setInterval(() => {
    if (progress.value < 100) {
      progress.value += 0.5;
    }
  }, 100);
}

function stopProgress() {
  clearInterval(progressInterval.value);
  progress.value = 0;
}

function play() {
  if (isPaused.value) {
    window.speechSynthesis.resume();
    isPlaying.value = true;
    isPaused.value = false;
    startProgress();
  } else {
    window.speechSynthesis.cancel();
    utterance.value = new SpeechSynthesisUtterance(props.script);
    utterance.value.lang = "en-US";
    utterance.value.rate = 0.9;
    utterance.value.pitch = 1;

    utterance.value.onstart = () => {
      isPlaying.value = true;
      isPaused.value = false;
      startProgress();
    };

    utterance.value.onend = () => {
      isPlaying.value = false;
      isPaused.value = false;
      utterance.value = null;
      stopProgress();
    };

    utterance.value.onpause = () => {
      isPlaying.value = false;
      isPaused.value = true;
      stopProgress();
    };

    utterance.value.onresume = () => {
      isPlaying.value = true;
      isPaused.value = false;
      startProgress();
    };

    window.speechSynthesis.speak(utterance.value);
  }
}

function pause() {
  window.speechSynthesis.pause();
}

function stop() {
  window.speechSynthesis.cancel();
  isPlaying.value = false;
  isPaused.value = false;
  utterance.value = null;
  stopProgress();
}

function togglePlay() {
  if (isPlaying.value) {
    pause();
  } else {
    play();
  }
}

function replay() {
  stop();
  setTimeout(() => play(), 100);
}

onUnmounted(() => {
  stop();
  clearInterval(progressInterval.value);
});
</script>
