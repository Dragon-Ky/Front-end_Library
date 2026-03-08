# Bước 1: Sử dụng Node.js bản LTS mới nhất làm nền
FROM node:22-alpine

# Bước 2: Thiết lập thư mục làm việc trong container
WORKDIR /app

# Bước 3: Copy các file quản lý thư viện trước để tận dụng cache của Docker
COPY package.json package-lock.json ./

# Bước 4: Cài đặt các thư viện (dependencies)
RUN npm install

# Bước 5: Copy toàn bộ mã nguồn vào container
COPY . .

# Bước 6: Mở cổng 5173 (cổng mặc định của Vite)
EXPOSE 5173

# Bước 7: Lệnh chạy ứng dụng ở chế độ development
CMD ["npm", "run", "dev", "--", "--host"]