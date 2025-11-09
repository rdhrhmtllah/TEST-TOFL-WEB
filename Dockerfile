# ==========================
# Tahap 1: Build Aplikasi Vue (Vite)
# ==========================
FROM node:18-alpine AS build

WORKDIR /app

# Salin file dependensi terlebih dahulu untuk caching
COPY package*.json ./

RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Salin semua source code
COPY . .

# Set environment build ke production
ENV NODE_ENV=production

# Build aplikasi Vue
RUN npm run build

# ==========================
# Tahap 2: Jalankan dengan Nginx
# ==========================
FROM nginx:1.25-alpine AS final

RUN rm -rf /etc/nginx/conf.d/*

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]


# docker run -d \
#   -e VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY \
#   -p 3000:80 \
#   my-app
