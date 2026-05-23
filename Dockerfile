FROM node:20-alpine

WORKDIR /app

# 全局安装 vite 确保可用
RUN npm install -g vite

# 构建前端
COPY frontend/ ./frontend/
RUN cd frontend && npm install && vite build

# 安装后端依赖
COPY backend/ ./backend/
RUN cd backend && npm install

# 把前端构建产物复制到后端 public 目录
RUN mkdir -p backend/public && cp -r frontend/dist/* backend/public/

WORKDIR /app/backend
EXPOSE 3001
CMD ["node", "server.js"]
