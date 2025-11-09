<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Mobile Top Bar (Compact) -->
    <div
      class="lg:hidden sticky top-0 left-0 right-0 z-40 bg-white shadow-sm border-b border-gray-200"
    >
      <div class="px-3 py-2">
        <div class="flex items-center justify-between">
          <!-- Left: Menu & Progress -->
          <div class="flex items-center gap-2 flex-1">
            <button
              @click="showMobileSidebar = true"
              class="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div class="flex items-center gap-1 text-xs">
              <span class="text-gray-500">Soal</span>
              <span class="font-semibold text-blue-600">{{ currentQuestionNumber }}</span>
              <span class="text-gray-400">/{{ totalQuestions }}</span>
            </div>

            <!-- Mobile Progress Bar -->
            <div class="flex-1 max-w-20">
              <div class="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  class="h-1.5 rounded-full transition-all duration-300"
                  :class="progressBarClass"
                  :style="{ width: progressPercentage + '%' }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Center: Timer -->
          <div class="flex-1 text-center">
            <div class="text-sm font-mono font-bold px-2 py-1 rounded" :class="timerBoxClass">
              {{ formattedTime }}
            </div>
          </div>

          <!-- Right: Score & Actions -->
          <div class="flex items-center gap-2 flex-1 justify-end">
            <div class="text-right">
              <div class="text-xs text-gray-500">Skor</div>
              <div class="text-sm font-bold text-green-600">{{ score }}</div>
            </div>

            <button
              v-if="!isSubmitted"
              @click="handleSubmit"
              class="bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-600 transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop Header -->
    <div class="hidden lg:block sticky top-0 z-30 bg-white shadow-lg border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <!-- Left Section -->
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg
                  class="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <div>
                <h1 class="text-lg font-bold text-gray-800">TOEFL Test</h1>
                <p class="text-sm text-gray-600">
                  {{ totalQuestions }} soal • {{ formattedTotalTime }}
                </p>
              </div>
            </div>

            <!-- Progress -->
            <div class="flex items-center gap-3">
              <div class="text-center">
                <div class="text-xs text-gray-600">Progress</div>
                <div class="text-sm font-bold text-blue-700">
                  {{ answeredQuestions }}/{{ totalQuestions }}
                </div>
              </div>
              <div class="w-24 bg-gray-200 rounded-full h-2">
                <div
                  class="h-2 rounded-full bg-green-500 transition-all duration-500"
                  :style="{ width: progressPercentage + '%' }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Right Section -->
          <div class="flex items-center gap-6">
            <!-- Timer -->
            <div class="text-center">
              <div class="text-xs text-gray-600">Sisa Waktu</div>
              <div class="text-xl font-mono font-bold" :class="timerClass">
                {{ formattedTime }}
              </div>
            </div>

            <!-- Score -->
            <div class="text-center">
              <div class="text-xs text-gray-600">Skor Sementara</div>
              <div class="text-xl font-bold text-green-700">
                {{ score }}/{{ gradableQuestions }}
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-2">
              <button
                @click="$emit('quizReset')"
                class="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
              >
                Reset
              </button>

              <button
                v-if="!isSubmitted"
                @click="handleSubmit"
                class="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Layout -->
    <div class="max-w-7xl mx-auto lg:flex lg:gap-4 pt-12 lg:pt-4">
      <!-- Desktop Sidebar -->
      <div class="hidden lg:block w-64 flex-shrink-0">
        <div class="sticky top-20 h-[calc(100vh-6rem)] overflow-y-auto p-2">
          <!-- Question Navigator -->
          <div class="bg-white rounded-lg p-3 shadow-sm border border-gray-200 mb-3">
            <h3 class="text-sm font-bold text-gray-800 mb-2">Navigasi Soal</h3>

            <div class="grid grid-cols-4 gap-1 mb-2">
              <button
                v-for="question in indexedQuestions"
                :key="question.originalIndex"
                @click="scrollToQuestion(question.originalIndex)"
                :class="[
                  'w-8 h-8 rounded text-xs font-semibold transition-all duration-200 border',
                  getQuestionButtonClass(question.originalIndex),
                ]"
                :title="`Soal ${question.originalIndex + 1}`"
              >
                {{ question.originalIndex + 1 }}
              </button>
            </div>

            <div class="text-xs text-gray-600 space-y-1 pt-2 border-t border-gray-100">
              <div class="flex items-center gap-1.5">
                <div class="w-2 h-2 bg-blue-500 rounded border border-blue-300"></div>
                <span>Aktif</span>
              </div>
              <div class="flex items-center gap-1.5">
                <div class="w-2 h-2 bg-green-500 rounded"></div>
                <span>Terjawab</span>
              </div>
              <div class="flex items-center gap-1.5">
                <div class="w-2 h-2 bg-gray-300 rounded"></div>
                <span>Belum</span>
              </div>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
            <h3 class="text-sm font-bold text-gray-800 mb-2">Statistik</h3>
            <div class="space-y-1.5 text-xs">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Terjawab</span>
                <span class="font-semibold text-green-600">{{ answeredQuestions }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Belum</span>
                <span class="font-semibold text-gray-600">{{
                  totalQuestions - answeredQuestions
                }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Progress</span>
                <span class="font-semibold text-blue-600">{{ progressPercentage }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Sidebar Overlay -->
      <div
        v-if="showMobileSidebar"
        class="lg:hidden fixed inset-0 z-50 bg-black/50"
        @click="showMobileSidebar = false"
      ></div>

      <!-- Mobile Sidebar -->
      <div
        :class="[
          'lg:hidden sticky top-0 left-0 z-50 h-full w-full bg-white transform transition-transform duration-300',
          showMobileSidebar ? 'translate-x-0' : '-translate-x-full hidden',
        ]"
      >
        <div class="h-full flex flex-col">
          <!-- Header -->
          <div class="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 class="text-lg font-bold text-gray-800">Navigasi Soal</h3>
            <button
              @click="showMobileSidebar = false"
              class="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto p-4">
            <div class="grid grid-cols-5 gap-2 mb-6">
              <button
                v-for="question in indexedQuestions"
                :key="question.originalIndex"
                @click="
                  scrollToQuestion(question.originalIndex);
                  showMobileSidebar = false;
                "
                :class="[
                  'w-12 h-12 rounded-lg text-sm font-semibold transition-all duration-200 border-2',
                  getQuestionButtonClass(question.originalIndex),
                ]"
              >
                {{ question.originalIndex + 1 }}
              </button>
            </div>

            <!-- Mobile Stats -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h4 class="font-semibold text-gray-800 mb-3 text-sm">Progress Tes</h4>
              <div class="space-y-2 text-xs">
                <div class="flex justify-between">
                  <span>Terjawab:</span>
                  <span class="font-semibold text-green-600">{{ answeredQuestions }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Belum Dijawab:</span>
                  <span class="font-semibold text-gray-600">{{
                    totalQuestions - answeredQuestions
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span>Progress:</span>
                  <span class="font-semibold text-blue-600">{{ progressPercentage }}%</span>
                </div>
                <div class="flex justify-between">
                  <span>Sisa Waktu:</span>
                  <span class="font-semibold" :class="timerClass">{{ formattedTime }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="p-4 border-t border-gray-200">
            <button
              @click="handleSubmit"
              class="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              Submit Tes
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="flex-1 min-w-0">
        <div class="lg:px-2 px-3 pb-20 lg:pb-6">
          <!-- Results Section - Sticky Top ketika selesai -->
          <div v-if="isSubmitted" class="sticky top-12 lg:top-4 z-20 mb-4">
            <div class="bg-white rounded-lg shadow-lg border border-green-200">
              <div class="p-4">
                <div class="flex items-center gap-3 mb-3">
                  <div
                    class="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm"
                    :class="isAutoSubmit ? 'bg-red-500' : 'bg-green-500'"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        v-if="isAutoSubmit"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
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
                  <div>
                    <h2
                      class="text-lg font-bold"
                      :class="isAutoSubmit ? 'text-red-600' : 'text-green-600'"
                    >
                      {{ isAutoSubmit ? "Waktu Habis!" : "Tes Selesai!" }}
                    </h2>
                    <p class="text-sm text-gray-600">Skor akhir Anda</p>
                  </div>
                </div>

                <!-- Score Cards -->
                <div class="grid grid-cols-3 gap-2">
                  <div class="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
                    <div class="text-lg font-bold text-blue-600">
                      {{ score }}/{{ gradableQuestions }}
                    </div>
                    <div class="text-xs text-blue-700 font-medium">Skor</div>
                  </div>

                  <div class="bg-green-50 p-3 rounded-lg border border-green-200 text-center">
                    <div class="text-lg font-bold text-green-600">{{ percentage }}%</div>
                    <div class="text-xs text-green-700 font-medium">Nilai</div>
                  </div>

                  <div class="bg-purple-50 p-3 rounded-lg border border-purple-200 text-center">
                    <div class="text-sm font-bold text-purple-600">{{ formattedTimeTaken }}</div>
                    <div class="text-xs text-purple-700 font-medium">Waktu</div>
                  </div>
                </div>

                <!-- Quick Actions -->
                <div class="flex gap-2 mt-3">
                  <button
                    @click="showAnalysis = true"
                    class="flex-1 bg-blue-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors"
                  >
                    Lihat Analisis
                  </button>
                  <button
                    @click="$emit('quizReset')"
                    class="flex-1 bg-gray-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-gray-600 transition-colors"
                  >
                    Tes Baru
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="totalQuestions === 0" class="text-center py-16">
            <div class="loader mx-auto mb-3"></div>
            <h3 class="text-base font-semibold text-gray-700 mb-1">Memuat Soal...</h3>
            <p class="text-sm text-gray-500">Silakan tunggu sebentar</p>
          </div>

          <!-- Questions Content -->
          <div v-else class="space-y-4">
            <!-- Structure Questions -->
            <section
              v-if="structureQuestions.length > 0"
              class="bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <div class="p-3 border-b border-gray-100">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                    <svg
                      class="w-3 h-3 text-white"
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
                  <h2 class="text-base font-bold text-gray-800">Structure</h2>
                  <span class="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded"
                    >{{ structureQuestions.length }} soal</span
                  >
                </div>
              </div>

              <div class="p-3 space-y-4">
                <div
                  v-for="(question, index) in structureQuestions"
                  :key="'s-' + index"
                  :data-question-index="question.originalIndex"
                  class="question-container"
                >
                  <QuizQuestion
                    :question="question.data"
                    :question-number="question.originalIndex + 1"
                    :is-submitted="isSubmitted"
                    :is-current="currentQuestionIndex === question.originalIndex"
                    v-model="safeUserAnswers[question.originalIndex]"
                    @update:modelValue="updateAnswer(question.originalIndex, $event)"
                  />
                </div>
              </div>
            </section>

            <!-- Structure Questions -->
            <section
              v-if="grammarQuestions.length > 0"
              class="bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <div class="p-3 border-b border-gray-100">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                    <svg
                      class="w-3 h-3 text-white"
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
                  <h2 class="text-base font-bold text-gray-800">Structure</h2>
                  <span class="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded"
                    >{{ grammarQuestions.length }} soal</span
                  >
                </div>
              </div>

              <div class="p-3 space-y-4">
                <div
                  v-for="(question, index) in grammarQuestions"
                  :key="'s-' + index"
                  :data-question-index="question.originalIndex"
                  class="question-container"
                >
                  <QuizQuestion
                    :question="question.data"
                    :question-number="question.originalIndex + 1"
                    :is-submitted="isSubmitted"
                    :is-current="currentQuestionIndex === question.originalIndex"
                    v-model="safeUserAnswers[question.originalIndex]"
                    @update:modelValue="updateAnswer(question.originalIndex, $event)"
                  />
                </div>
              </div>
            </section>

            <!-- Expression Questions -->
            <section
              v-if="expressionQuestions.length > 0"
              class="bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <div class="p-3 border-b border-gray-100">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                    <svg
                      class="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </div>
                  <h2 class="text-base font-bold text-gray-800">Written Expression</h2>
                  <span class="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded"
                    >{{ expressionQuestions.length }} soal</span
                  >
                </div>
              </div>

              <div class="p-3 space-y-4">
                <div
                  v-for="(question, index) in expressionQuestions"
                  :key="'e-' + index"
                  :data-question-index="question.originalIndex"
                  class="question-container"
                >
                  <QuizQuestion
                    :question="question.data"
                    :question-number="question.originalIndex + 1"
                    :is-submitted="isSubmitted"
                    :is-current="currentQuestionIndex === question.originalIndex"
                    v-model="safeUserAnswers[question.originalIndex]"
                    @update:modelValue="updateAnswer(question.originalIndex, $event)"
                  />
                </div>
              </div>
            </section>

            <!-- Reading Questions -->
            <section
              v-if="readingQuestions.length > 0"
              class="bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <div class="p-3 border-b border-gray-100">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 bg-purple-500 rounded flex items-center justify-center">
                    <svg
                      class="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <h2 class="text-base font-bold text-gray-800">Reading</h2>
                  <span class="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded"
                    >{{ readingQuestions.length }} soal</span
                  >
                </div>
              </div>

              <div class="p-3 space-y-4">
                <div
                  v-for="(question, index) in readingQuestions"
                  :key="'r-' + index"
                  :data-question-index="question.originalIndex"
                  class="question-container"
                >
                  <div
                    v-if="question.data.passage && isNewPassage(question, readingQuestions, index)"
                    class="bg-purple-50 p-3 rounded-lg mb-3 border border-purple-200"
                  >
                    <h4 class="text-sm font-semibold text-purple-800 mb-2">Wacana:</h4>
                    <p class="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {{ question.data.passage }}
                    </p>
                  </div>

                  <QuizQuestion
                    :question="question.data"
                    :question-number="question.originalIndex + 1"
                    :is-subscribed="isSubmitted"
                    :is-current="currentQuestionIndex === question.originalIndex"
                    v-model="safeUserAnswers[question.originalIndex]"
                    @update:modelValue="updateAnswer(question.originalIndex, $event)"
                  />
                </div>
              </div>
            </section>

            <!-- Listening Questions -->
            <section
              v-if="listeningQuestions.length > 0"
              class="bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <div class="p-3 border-b border-gray-100">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
                    <svg
                      class="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                      />
                    </svg>
                  </div>
                  <h2 class="text-base font-bold text-gray-800">Listening</h2>
                  <span class="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded"
                    >{{ listeningQuestions.length }} soal</span
                  >
                </div>
              </div>

              <div class="p-3 space-y-4">
                <div
                  v-for="(question, index) in listeningQuestions"
                  :key="'l-' + index"
                  :data-question-index="question.originalIndex"
                  class="question-container"
                >
                  <!-- <div
                    v-if="
                      question.data.passage && isNewPassage(question, listeningQuestions, index)
                    "
                    class="bg-orange-50 p-3 rounded-lg mb-3 border border-orange-200"
                  >
                    <h4 class="text-sm font-semibold text-orange-800 mb-2">Script Audio:</h4>
                    <AudioPlayer :script="question.data.passage" />
                  </div> -->

                  <QuizQuestion
                    :question="question.data"
                    :question-number="question.originalIndex + 1"
                    :is-submitted="isSubmitted"
                    :is-current="currentQuestionIndex === question.originalIndex"
                    v-model="safeUserAnswers[question.originalIndex]"
                    @update:modelValue="updateAnswer(question.originalIndex, $event)"
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Floating Submit Button -->
    <div v-if="!isSubmitted && totalQuestions > 0" class="lg:hidden fixed bottom-4 right-4 z-30">
      <button
        @click="handleSubmit"
        class="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onUnmounted, ref, onMounted, watch } from "vue";
import { useQuiz } from "../src/composables/useQuiz.js";
import QuizQuestion from "../components/QuizQuestion.vue";
import AudioPlayer from "../components/AudioPlayer.vue";

defineEmits(["quizReset"]);

// State
const currentQuestionIndex = ref(0);
const showMobileSidebar = ref(false);
const showAnalysis = ref(false);
const localUserAnswers = ref([]);

// Get quiz state
const {
  quizState,
  userAnswers,
  isSubmitted,
  isAutoSubmit,
  secondsRemaining,
  score,
  gradableQuestions,
  timeTaken,
  submitQuiz,
} = useQuiz();

// Safe computed properties
const safeUserAnswers = computed(() => {
  if (!userAnswers || !Array.isArray(userAnswers)) {
    if (localUserAnswers.value.length !== totalQuestions.value) {
      localUserAnswers.value = Array(totalQuestions.value).fill(null);
    }
    return localUserAnswers.value;
  }
  return userAnswers;
});

const formattedTime = computed(() => {
  const minutes = Math.floor(secondsRemaining.value / 60);
  const seconds = secondsRemaining.value % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
});

const formattedTotalTime = computed(() => {
  const totalSeconds = quizState.initialTotalSeconds || totalQuestions.value * 60;
  const minutes = Math.floor(totalSeconds / 60);
  return `${minutes} menit`;
});

const log = () => {
  console.log("ini skor", score);
};
const percentage = computed(() => {
  return (gradableQuestions.value > 0 ? (score.value / gradableQuestions.value) * 100 : 0).toFixed(
    0
  );
});

const formattedTimeTaken = computed(() => {
  const totalSeconds = timeTaken.value;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
});

const totalQuestions = computed(() => {
  return quizState.questions?.length || 0;
});

const currentQuestionNumber = computed(() => currentQuestionIndex.value + 1);

const answeredQuestions = computed(() => {
  return (
    safeUserAnswers.value?.filter((answer) => answer !== null && answer !== undefined).length || 0
  );
});

const progressPercentage = computed(() => {
  return totalQuestions.value > 0 ? (answeredQuestions.value / totalQuestions.value) * 100 : 0;
});

const timerClass = computed(() => {
  if (isSubmitted.value) return "text-gray-600";
  if (secondsRemaining.value <= 60) return "text-red-600";
  if (secondsRemaining.value <= 300) return "text-orange-500";
  return "text-green-600";
});

const timerBoxClass = computed(() => {
  if (isSubmitted.value) return "bg-gray-100 text-gray-600";
  if (secondsRemaining.value <= 60) return "bg-red-100 text-red-700";
  if (secondsRemaining.value <= 300) return "bg-orange-100 text-orange-700";
  return "bg-green-100 text-green-700";
});

const progressBarClass = computed(() => {
  if (secondsRemaining.value <= 60) return "bg-red-500";
  if (secondsRemaining.value <= 300) return "bg-orange-500";
  return "bg-green-500";
});

// Questions data
const indexedQuestions = computed(() => {
  if (!quizState.questions || !Array.isArray(quizState.questions)) {
    return [];
  }
  return quizState.questions.map((data, originalIndex) => ({ data, originalIndex }));
});

const structureQuestions = computed(() =>
  indexedQuestions.value.filter((q) => q.data?.type === "structure")
);
const grammarQuestions = computed(() =>
  indexedQuestions.value.filter((q) => q.data?.type === "grammar")
);
const expressionQuestions = computed(() =>
  indexedQuestions.value.filter((q) => q.data?.type === "expression")
);
const readingQuestions = computed(() =>
  indexedQuestions.value.filter((q) => q.data?.type === "reading")
);
const listeningQuestions = computed(() =>
  indexedQuestions.value.filter((q) => q.data?.type === "listening")
);

// Functions
function updateAnswer(questionIndex, value) {
  localUserAnswers.value[questionIndex] = value;
  if (userAnswers) {
    userAnswers[questionIndex] = value;
  }
}

function getQuestionButtonClass(questionIndex) {
  if (currentQuestionIndex.value === questionIndex) {
    return "bg-blue-500 text-white border-blue-300";
  }
  const answer = safeUserAnswers.value[questionIndex];
  if (answer !== null && answer !== undefined) {
    return "bg-green-500 text-white border-green-300";
  }
  return "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300";
}

function scrollToQuestion(questionIndex) {
  const questionElement = document.querySelector(`[data-question-index="${questionIndex}"]`);
  if (questionElement) {
    questionElement.scrollIntoView({ behavior: "smooth", block: "start" });
    currentQuestionIndex.value = questionIndex;
  }
}

function isNewPassage(question, questions, index) {
  if (index === 0) return true;
  return question.data.passage !== questions[index - 1].data.passage;
}

// Initialize
watch(
  totalQuestions,
  (newCount) => {
    if (newCount > 0 && localUserAnswers.value.length !== newCount) {
      localUserAnswers.value = Array(newCount).fill(null);
    }
  },
  { immediate: true }
);

// Scroll tracking
onMounted(() => {
  const handleScroll = () => {
    const questions = document.querySelectorAll("[data-question-index]");
    let closestIndex = 0;
    let closestDistance = Infinity;

    questions.forEach((question) => {
      const rect = question.getBoundingClientRect();
      const distance = Math.abs(rect.top);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = parseInt(question.dataset.questionIndex);
      }
    });

    currentQuestionIndex.value = closestIndex;
  };

  window.addEventListener("scroll", handleScroll);
  onUnmounted(() => window.removeEventListener("scroll", handleScroll));
});

onUnmounted(() => {
  window.speechSynthesis.cancel();
});

function handleSubmit() {
  submitQuiz(false);
}
</script>

<style scoped>
.loader {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.question-container {
  scroll-margin-top: 80px;
}

/* Optimize for mobile */
@media (max-width: 1024px) {
  .question-container {
    scroll-margin-top: 60px;
  }
}

/* Ensure no horizontal overflow */
.container-limit {
  max-width: 100%;
  overflow-x: hidden;
}
</style>
