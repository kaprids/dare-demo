FROM node:20-slim

WORKDIR /app

# === 后端依赖安装 ===
COPY backend/package.json backend/package-lock.json ./backend/
RUN cd /app/backend && npm install

# === 前端：复制全部源码 + 安装 + 构建 ===
COPY frontend/ ./frontend/
RUN cd /app/frontend && npm install && ./node_modules/.bin/vite build

# === 复制构建产物到后端 public 目录 ===
RUN mkdir -p /app/backend/public && cp -r /app/frontend/dist/* /app/backend/public/

# === 复制后端源码（保留已安装的 node_modules）===
COPY backend/server.js ./backend/

WORKDIR /app/backend

EXPOSE 3001

CMD ["node", "server.js"]
