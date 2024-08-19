# 使用 Node.js 作为基础镜像
FROM node:20-alpine AS base
# FROM anolis-registry.cn-zhangjiakou.cr.aliyuncs.com/openanolis/node:latest AS base

FROM base AS builder

# 构建阶段
WORKDIR /app

# 改变/app目录及其内部文件的所有者
# RUN chown -Rh $user:$user /app

# USER $user

COPY . .

RUN npm config set registry https://mirrors.cloud.tencent.com/npm/

RUN npm cache clean --force

RUN npm i pnpm -g --registry=https://mirrors.cloud.tencent.com/npm/

RUN pnpm i --ignore-scripts --registry=https://mirrors.cloud.tencent.com/npm/

ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true

RUN pnpx prisma generate

# 构建项目
RUN pnpm run build

# 暴露容器 80 端口
EXPOSE 80

# 为 next.js 服务设置端口环境变量
ENV PORT 80

ENV HOSTNAME="0.0.0.0"

# 启动应用
CMD ["pnpm", "run", "start"]
# CMD ["node", "server.js"]