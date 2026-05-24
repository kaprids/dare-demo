FROM node:20-slim

WORKDIR /app

# 1. 复制后端代码和依赖声明
COPY backend/package.json backend/package-lock.json ./backend/

# 2. 安装后端依赖（先装后端，确保 express 等在 node_modules 中）
RUN cd /app/backend && npm install

# 3. 复制前端代码和依赖声明
COPY frontend/package.json frontend/package-lock.json ./frontend/

# 4. 安装前端依赖
RUN cd /app/frontend && npm install

# 5. 构建前端
RUN cd /app/frontend && ./node_modules/.bin/vite build

# 6. 复制前端构建产物到后端 public 目录
RUN mkdir -p /app/backend/public && cp -r /app/frontend/dist/* /app/backend/public/

# 7. 复制后端源码（覆盖，保留已安装的 node_modules）
COPY backend/ ./backend/

# 8. 工作目录设为后端
WORKDIR /app/backend

# 9. 暴露端口
EXPOSE 3001

# 10. 启动命令
CMD ["node", "server.js"]
