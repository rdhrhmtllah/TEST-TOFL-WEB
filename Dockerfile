# ==========================
# Tahap 1: Build Aplikasi Vue (Vite)
# ==========================
FROM node:18-alpine AS build

WORKDIR /app

# Salin file dependensi terlebih dahulu untuk caching
COPY package*.json ./

# Gunakan npm ci jika ada package-lock.json (lebih cepat dan konsisten)
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Salin semua source code
COPY . .

# Set environment build ke production
ENV NODE_ENV=production

# Bila butuh API key, gunakan ARG agar tidak tersimpan di image akhir
ARG VITE_GEMINI_API_KEY
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY

# Build aplikasi Vue
RUN npm run build


# ==========================
# Tahap 2: Jalankan dengan Nginx
# ==========================
FROM nginx:1.25-alpine AS final

# Hapus konfigurasi default nginx (opsional)
RUN rm -rf /etc/nginx/conf.d/*

# Salin file build dari tahap sebelumnya
COPY --from=build /app/dist /usr/share/nginx/html

# Salin konfigurasi nginx custom
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Jalankan nginx
CMD ["nginx", "-g", "daemon off;"]
