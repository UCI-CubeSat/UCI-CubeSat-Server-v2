ARG DATABASE_URL

###############################################
# Node Base Image
###############################################
FROM node:18.13.0-alpine as node-base

###############################################
# Builder Image
###############################################
FROM node-base AS builder-base
RUN apk update
RUN apk add python3
RUN apk add gcc
RUN apk add make
RUN apk add g++

WORKDIR /app

COPY .nvmrc* ./
COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm 
RUN pnpm i --frozen-lockfile;

###############################################
# Production Image
###############################################
FROM node:18.13.0-alpine as production
RUN npm install -g pnpm 
WORKDIR /opt/app
RUN chmod -R 0777 /opt/app
COPY --from=builder-base /app/node_modules ./node_modules
COPY . .
ENV ENV=${ENV:-qa}
RUN DATABASE_URL=$DATABASE_URL pnpm run build:prod
RUN addgroup --system --gid 1001 nodejs
USER 10000:10001

ENTRYPOINT ["sh", "./entrypoint.sh"]
