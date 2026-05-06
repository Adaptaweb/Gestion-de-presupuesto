# 1. Fase de Construcción (Build) del Frontend
FROM node:22-alpine AS build
WORKDIR /app

# Copiar archivos del Frontend (React/Vite)
COPY package.json package-lock.json* ./
RUN npm install

# Copiar el resto del código y compilar React
COPY . .
RUN npm run build

# 2. Fase de Producción
FROM node:22-alpine
WORKDIR /app

# Instalar dependencias del Backend
COPY server/package.json server/package-lock.json* ./server/
RUN cd server && npm install --omit=dev

# Copiar el backend (solo archivos necesarios)
COPY server/index.js server/db.js ./server/
RUN mkdir -p /app/server/data

# Copiar los archivos compilados del frontend
COPY --from=build /app/dist ./dist

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3000

# Exponer el puerto
EXPOSE 3000

# Script de arranque
CMD ["node", "server/index.js"]
