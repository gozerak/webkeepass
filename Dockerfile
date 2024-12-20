# Dockerfile для React-приложения
# Используем правильную версию Node.js
FROM node:18 AS build

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код приложения
COPY . .

# Сборка приложения
RUN npm run build && ls -la /app/dist

FROM nginx:alpine

# Создаем директорию для SSL-сертификатов
RUN mkdir -p /etc/nginx/ssl

# Копируем собранные файлы в директорию Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем кастомный конфиг nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порты
EXPOSE 80 443

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]