FROM node:20-alpine

WORKDIR /app

# 构建前端
COPY frontend/package.json frontend/package-lock.json ./frontend/
RUN cd frontend && npm install
COPY frontend/ ./frontend/
RUN cd frontend && npx vite build

# 安装后端依赖
COPY backend/package.json backend/package-lock.json ./backend/
RUN cd backend && npm install
COPY backend/ ./backend/

# 把前端构建产物复制到后端 public 目录
RUN mkdir -p backend/public && cp -r frontend/dist/* backend/public/

WORKDIR /app/backend
EXPOSE 3001
CMD ["node", "server.js"]
