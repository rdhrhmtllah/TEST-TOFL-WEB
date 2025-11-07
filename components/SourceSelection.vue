<template>
  <div class="white p-8 md:p-12 rounded-2xl shadow-lg text-center">
    <header class="mb-8">
      <h1 class="text-3xl md:text-4xl font-bold text-blue-700 mb-3">Selamat Datang di Tes TOEFL</h1>
      <p class="text-lg text-red-600">Langkah 1: Pilih Sumber Soal Anda</p>
    </header>
    <div class="max-w-md mx-auto">
      <button @click="$emit('select', 'default')" class="source-btn">
        <h3 class="text-blue-700 text-xl">Gunakan Soal Default</h3>
        <p>Mulai tes dengan 50 soal (Structure & Written Expression) yang sudah disiapkan.</p>
      </button>
      <button @click="$emit('select', 'ai')" class="source-btn">
        <h3>Buat Soal dengan AI (Baru)</h3>
        <p>Minta AI untuk membuat soal baru (Reading, Listening, Structure, dll.)</p>
      </button>
      <button @click="$emit('select', 'import')" class="source-btn">
        <h3>Impor Soal (JSON)</h3>
        <p>Muat soal Anda sendiri dari file JSON yang sudah Anda miliki.</p>
      </button>
    </div>
  </div>
</template>

<script setup>
defineEmits(["select"]);
</script>
