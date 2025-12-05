# Sử dụng Node.js bản 18
FROM node:18

# Tạo thư mục làm việc trong container
WORKDIR /app

# Copy file package để cài thư viện trước
COPY package*.json ./
RUN npm install

# Copy toàn bộ code vào
COPY . .

# Mở cổng 5000
EXPOSE 5000

# Lệnh chạy server
CMD ["npm", "run", "dev"] 
# (Hoặc "node server.js" nếu bạn không dùng nodemon)