#!/bin/sh

# Generate file env.js di folder web root Nginx
echo "window.RUNTIME_ENV = {" > /usr/share/nginx/html/env.js
echo "  VITE_GEMINI_API_KEY: '${VITE_GEMINI_API_KEY}'" >> /usr/share/nginx/html/env.js
echo "};" >> /usr/share/nginx/html/env.js

# Jalankan nginx
exec nginx -g "daemon off;"
