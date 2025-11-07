// Mengambil API Key dari environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

/**
 * Fungsi untuk melakukan retry eksponensial
 */
async function fetchWithRetry(url, options, maxRetries = 5, baseDelay = 1000) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return response.json();
      } else if (response.status === 429 || (response.status >= 500 && response.status <= 599)) {
        // Throttling or server error
        const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        // Error klien lain, jangan retry
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    attempt++;
  }
}

/**
 * Fungsi utama untuk memanggil Gemini API
 * @param {Array|string} promptOrHistory - Prompt string atau array riwayat chat
 * @param {object|null} schema - Skema JSON untuk output terstruktur
 * @param {string} systemInstructionText - Instruksi sistem kustom
 * @returns {Promise<string|null>} - Respon teks dari model
 */
export async function callGemini(promptOrHistory, schema = null, systemInstructionText = null) {
  if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
    const errorMsg = "Error: API Key belum dikonfigurasi. Silakan isi di file .env Anda.";
    console.error(errorMsg);
    if (!schema) return errorMsg; // Kembalikan error sebagai teks untuk mode chat
    throw new Error(errorMsg); // Lemparkan error untuk mode JSON/schema
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  const payload = {
    contents: Array.isArray(promptOrHistory)
      ? promptOrHistory
      : [{ parts: [{ text: promptOrHistory }] }],
    systemInstruction: { parts: [{ text: "" }] },
    generationConfig: {},
  };

  if (!schema) {
    delete payload.generationConfig;
    payload.systemInstruction.parts[0].text =
      systemInstructionText ||
      "Anda adalah seorang guru TOEFL. Berikan penjelasan dalam Bahasa Indonesia. PENTING: Gunakan HANYA format Markdown dasar (seperti `**bold**`, `*italic*`, `## Judul`, dan paragraf). JANGAN gunakan tabel Markdown atau daftar poin (bullet/numbered list) karena sulit ditampilkan.";
  } else {
    payload.systemInstruction.parts[0].text =
      "Anda adalah ahli pembuat soal TOEFL dan tutor. Anda HARUS mengembalikan data HANYA dalam format JSON yang diminta, tanpa teks tambahan.";
    payload.generationConfig = {
      responseMimeType: "application/json",
      responseSchema: schema,
    };
  }

  try {
    const result = await fetchWithRetry(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const candidate = result?.candidates?.[0];
    if (candidate && candidate.content?.parts?.[0]?.text) {
      return candidate.content.parts[0].text;
    } else {
      console.error("Respon API tidak valid:", result);
      throw new Error("Respon API tidak valid atau kosong.");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return null;
  }
}
