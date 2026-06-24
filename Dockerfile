# Nâng lên Node 20 hoặc 22 Alpine để có sẵn thư viện crypto global
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Mẹo nhỏ cho NestJS: Nên dùng npm ci hoặc cài thêm các build tool nếu cần, 
# nhưng cơ bản npm install vẫn ổn
RUN npm install

COPY . .

EXPOSE 3000

# Tự động chạy Migration (và Seed nếu cần) trước khi bật server
CMD sh -c "npm run migration:run && npm start"