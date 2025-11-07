<template>
  <div v-if="show" class="modal-overlay" @click.self="$emit('cancel')">
    <div class="modal-content">
      <h2 class="text-xl font-bold mb-4">{{ title }}</h2>
      <p class="text-gray-700 mb-6">{{ message }}</p>
      <div class="flex justify-end gap-3">
        <button
          @click="$emit('cancel')"
          class="gray-200 text-gray-800 font-semibold py-2 px-5 rounded-lg hover:gray-300 transition duration-300"
        >
          Batal
        </button>
        <button
          @click="$emit('confirm')"
          :class="[
            'text-white font-bold py-2 px-5 rounded-lg transition duration-300',
            confirmColorClass,
          ]"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  show: Boolean,
  title: String,
  message: String,
  confirmText: {
    type: String,
    default: "Yakin",
  },
  confirmColor: {
    type: String,
    default: "red-600", // default untuk 'reset'
  },
});
defineEmits(["confirm", "cancel"]);

const confirmColorClass = computed(() => {
  return `${props.confirmColor} hover:${props.confirmColor.replace("600", "700")}`;
});
</script>
