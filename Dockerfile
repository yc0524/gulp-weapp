FROM docker.io/aimeimjj/game_platform_fe_build:latest as build-stage
WORKDIR /app

ADD package.json ./
ADD package-lock.json ./
RUN npm install

COPY . .
ARG NODE_ENV
ENV NODE_ENV ${NODE_ENV}
RUN npm run build