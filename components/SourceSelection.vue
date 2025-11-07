<template>
  <div class="card max-w-4xl mx-auto text-center">
    <!-- Header -->
    <div class="mb-12">
      <div
        class="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-2xl pulse-glow"
      >
        <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      </div>
      <h1
        class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4"
      >
        TOEFL Preparation
      </h1>
      <p class="text-xl text-gray-600 mb-2">
        Pilih sumber soal untuk memulai perjalanan belajar Anda
      </p>
      <div class="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
    </div>

    <!-- Source Options -->
    <div class="grid md:grid-cols-3 gap-6 mb-8">
      <!-- Default Questions -->
      <button
        @click="$emit('select', 'default')"
        class="source-btn group text-center p-8 hover:scale-105 transition-transform duration-300"
      >
        <div
          class="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
        >
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        <h3 class="text-xl font-bold mb-3">Soal Default</h3>
        <p class="text-gray-600 text-sm leading-relaxed">
          Mulai dengan 50 soal Structure & Written Expression yang telah teruji kualitasnya
        </p>
        <div class="mt-4 text-xs text-blue-600 font-semibold">⚡ Cepat & Terpercaya</div>
      </button>

      <!-- AI Generator -->
      <button
        @click="$emit('select', 'ai')"
        class="source-btn group text-center p-8 hover:scale-105 transition-transform duration-300"
      >
        <div
          class="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
        >
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <h3 class="text-xl font-bold mb-3">AI Generator</h3>
        <p class="text-gray-600 text-sm leading-relaxed">
          Minta AI membuat soal custom sesuai kebutuhan spesifik Anda dengan berbagai tipe soal
        </p>
        <div class="mt-4 text-xs text-purple-600 font-semibold">🎯 Personal & Adaptif</div>
      </button>

      <!-- Import/Export -->
      <button
        @click="$emit('select', 'import')"
        class="source-btn group text-center p-8 hover:scale-105 transition-transform duration-300"
      >
        <div
          class="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
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
        <h3 class="text-xl font-bold mb-3">Impor Soal</h3>
        <p class="text-gray-600 text-sm leading-relaxed">
          Gunakan soal Anda sendiri dengan format JSON. Impor, ekspor, dan kelola koleksi soal
        </p>
        <div class="mt-4 text-xs text-orange-600 font-semibold">📁 Fleksibel & Kustom</div>
      </button>
    </div>

    <!-- Features -->
    <div class="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-200">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Fitur Unggulan</h3>
      <div class="grid md:grid-cols-4 gap-4 text-sm">
        <div class="flex items-center gap-2 text-gray-600">
          <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>Timer Otomatis</span>
        </div>
        <div class="flex items-center gap-2 text-gray-600">
          <div class="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Analisa AI</span>
        </div>
        <div class="flex items-center gap-2 text-gray-600">
          <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
          <span>Penjelasan Detail</span>
        </div>
        <div class="flex items-center gap-2 text-gray-600">
          <div class="w-2 h-2 bg-orange-500 rounded-full"></div>
          <span>Progress Tracking</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(["select"]);
</script>
