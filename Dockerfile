# 使用 Node.js 作为基础镜像
FROM node:20-alpine

# 构建阶段
WORKDIR /app

COPY . .

RUN npm config set registry https://mirrors.cloud.tencent.com/npm/

RUN npm i pnpm -g --registry=https://mirrors.cloud.tencent.com/npm/

RUN pnpm i --registry=https://mirrors.cloud.tencent.com/npm/

RUN pnpx prisma generate

# 暴露容器 80 端口
EXPOSE 80

# 为 next.js 服务设置端口环境变量
ENV PORT 80

ENV HOSTNAME="0.0.0.0"

RUN pnpm run build && pnpm run start