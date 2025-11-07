<template>
  <div class="audio-player">
    <span class="audio-player-label">Audio Soal:</span>
    <button type="button" @click="togglePlay" title="Play/Pause">
      <span class="play-pause-btn-icon" v-html="playIcon"></span>
    </button>
    <button type="button" @click="replay" title="Replay" class="replay-btn">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="w-5 h-5"
      >
        <path
          fill-rule="evenodd"
          d="M15.312 11.424a5.5 5.5 0 0 1-9.324 5.092l.966-.351A4.5 4.5 0 0 0 15 11.5a4.5 4.5 0 0 0-8.624-2.115l.946.463a.75.75 0 1 1-.41 1.456l-2.25-1.1a.75.75 0 0 1 0-1.389l2.25-1.1a.75.75 0 1 1 .41 1.456l-.946.463A5.5 5.5 0 0 1 15.312 11.424Z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
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

const ICONS = {
  PLAY: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm6.39-2.908a.75.75 0 0 1 .766.013l3.75 2.25a.75.75 0 0 1 0 1.29l-3.75 2.25a.75.75 0 0 1-1.153-.645V7.75a.75.75 0 0 1 .387-.657Z" clip-rule="evenodd" /></svg>`,
  PAUSE: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm6-2.25A1.75 1.75 0 0 0 6.25 9.5v1A1.75 1.75 0 0 0 8 12.25h.25a1.75 1.75 0 0 0 1.75-1.75v-1A1.75 1.75 0 0 0 8.25 7.75H8Zm5.5 0A1.75 1.75 0 0 0 11.75 9.5v1A1.75 1.75 0 0 0 13.5 12.25h.25a1.75 1.75 0 0 0 1.75-1.75v-1A1.75 1.75 0 0 0 13.75 7.75h-.25Z" clip-rule="evenodd" /></svg>`,
};

const playIcon = computed(() => (isPlaying.value ? ICONS.PAUSE : ICONS.PLAY));

function play() {
  if (isPaused.value) {
    window.speechSynthesis.resume();
    isPlaying.value = true;
    isPaused.value = false;
  } else {
    window.speechSynthesis.cancel(); // Hentikan yang lain
    utterance.value = new SpeechSynthesisUtterance(props.script);
    utterance.value.lang = "en-US";

    utterance.value.onstart = () => {
      isPlaying.value = true;
      isPaused.value = false;
    };

    utterance.value.onend = () => {
      isPlaying.value = false;
      isPaused.value = false;
      utterance.value = null;
    };

    utterance.value.onpause = () => {
      isPlaying.value = false;
      isPaused.value = true;
    };

    utterance.value.onresume = () => {
      isPlaying.value = true;
      isPaused.value = false;
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
  play();
}

onUnmounted(() => {
  stop(); // Pastikan audio berhenti saat pindah
});
</script>
