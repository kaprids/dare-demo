FROM node:20-slim

WORKDIR /app

# 一次性复制整个项目
COPY . .

# 安装后端依赖
RUN cd /app/backend && npm install --omit=dev

# 安装前端依赖并构建
RUN cd /app/frontend && npm install && npx vite build

# 把前端构建产物复制到后端 public 目录
RUN mkdir -p /app/backend/public && cp -r /app/frontend/dist/* /app/backend/public/

WORKDIR /app/backend

EXPOSE 3001

CMD ["node", "server.js"]
