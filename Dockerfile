# Tahap 1: Build Aplikasi Vue
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Pastikan VITE_GEMINI_API_KEY diatur saat build
ARG VITE_GEMINI_API_KEY
ENV VITE_GEMINI_API_KEY=${VITE_GEMINI_API_KEY}
RUN npm run build

# Tahap 2: Serve dengan Nginx
FROM nginx:1.25-alpine AS final
# Salin file build dari tahap sebelumnya
COPY --from=build /app/dist /usr/share/nginx/html
# Salin konfigurasi Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]