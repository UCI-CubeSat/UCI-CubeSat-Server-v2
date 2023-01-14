ARG nodeVersion=16.13.0
ARG nginxVersion=1.20.2
ARG alpineVersion=3.11

###############################################
# Node Base Image
###############################################
FROM node:${nodeVersion}-alpine${alpineVersion} as node-base

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
RUN \
  if [ -f pnpm-lock.yaml ]; then npm install -g pnpm \
    && pnpm i --frozen-lockfile; \
  elif [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  else npm i --no-optional; \
  fi

###############################################
# Production Image
###############################################
FROM node:${nodeVersion}-alpine${alpineVersion} as production
WORKDIR /opt/app
RUN chmod -R 0777 /opt/app
COPY --from=builder-base /app/node_modules ./node_modules
COPY . .
RUN npm run build:prod

ENV ENV=${ENV:-qa}
RUN addgroup --system --gid 1001 nodejs
USER 10000:10001

ENTRYPOINT ["sh", "./entrypoint.sh"]
