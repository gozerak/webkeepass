# Используем Node.js для сборки
FROM node:18-alpine AS build

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install --legacy-peer-deps

# Копируем исходный код
COPY . .

# Делаем Webpack исполняемым
RUN chmod +x node_modules/.bin/webpack

# Сборка приложения
RUN npx webpack --mode production && ls -la /app/dist

# Используем Nginx для раздачи файлов
FROM nginx:alpine

# Создаем директорию для SSL
RUN mkdir -p /etc/nginx/ssl

# Копируем собранное приложение
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем конфигурацию nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порты
EXPOSE 8080 443

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
