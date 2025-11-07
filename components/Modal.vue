<template>
  <transition
    enter-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="show" class="modal-overlay" @click.self="$emit('cancel')">
      <transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div class="modal-content">
          <!-- Header -->
          <div class="text-center mb-6">
            <div
              class="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg"
              :class="iconColor"
            >
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  v-if="confirmColor.includes('red')"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
                <path
                  v-else
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-800">{{ title }}</h2>
          </div>

          <!-- Message -->
          <p class="text-gray-600 text-center mb-8 leading-relaxed">{{ message }}</p>

          <!-- Actions -->
          <div class="flex gap-4">
            <button @click="$emit('cancel')" class="btn-secondary flex-1 text-center">Batal</button>
            <button
              @click="$emit('confirm')"
              :class="[
                'flex-1 text-center font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300',
                confirmColorClass,
              ]"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  show: Boolean,
  title: String,
  message: String,
  confirmText: {
    type: String,
    default: "Konfirmasi",
  },
  confirmColor: {
    type: String,
    default: "bg-gradient-to-r from-blue-600 to-purple-600",
  },
});

defineEmits(["confirm", "cancel"]);

const confirmColorClass = computed(() => {
  return `${props.confirmColor} hover:${props.confirmColor.replace("600", "700")} text-white`;
});

const iconColor = computed(() => {
  if (props.confirmColor.includes("red")) {
    return "bg-gradient-to-r from-red-500 to-pink-600";
  } else if (props.confirmColor.includes("green")) {
    return "bg-gradient-to-r from-green-500 to-teal-600";
  }
  return "bg-gradient-to-r from-blue-500 to-purple-600";
});
</script>
