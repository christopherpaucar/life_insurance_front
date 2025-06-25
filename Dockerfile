# 1. Etapa de Dependencias: Instalar dependencias
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# 2. Etapa de Build: Construir la aplicación
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# La variable de entorno para telemetría de Next.js se deshabilita para evitar que se envíen datos durante el build
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# 3. Etapa de Producción: Ejecutar la aplicación
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Deshabilitar telemetría en producción también
ENV NEXT_TELEMETRY_DISABLED 1

# Copiar los archivos de la etapa de build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Exponer el puerto que usa la aplicación (Next.js usa 3000 por defecto)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"] 