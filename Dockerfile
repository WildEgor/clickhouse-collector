# ------------ STAGE: Install deps
FROM node:18.16.0-alpine3.17 as deps
ENV NODE_ENV development
LABEL stage=deps

WORKDIR /srv/deps

RUN yarn global add @nestjs/cli

COPY package.json ./
COPY yarn.lock ./
COPY tsconfig*.json ./
COPY .npmrc ./

RUN yarn install --frozen-lockfile

# ------------ STAGE: Dev app
FROM node:18.16.0-alpine3.17 as dev
LABEL stage=dev
ENV NODE_ENV development

WORKDIR /srv/app
RUN mkdir -p /srv/app/ch_cache

COPY . .

RUN yarn global add @nestjs/cli
RUN yarn install

EXPOSE 8080
CMD ["yarn", "start:dev"]

# ------------ STAGE: Build app
FROM node:18.16.0-alpine3.17 as build
LABEL stage=build
ENV NODE_ENV production

WORKDIR /srv/build

COPY . .
COPY --from=deps /srv/deps/node_modules ./node_modules

RUN yarn build
RUN yarn install --production && yarn cache clean

# ------------ STAGE: Execute app
FROM node:18.16.0-alpine3.17 as execute
LABEL stage=execute
ENV NODE_ENV production

WORKDIR /srv/app
RUN mkdir -p /srv/app/ch_cache

RUN apk update && apk upgrade && apk add --no-cache bash curl

COPY --from=build /srv/build/node_modules ./node_modules
COPY --from=build /srv/build/dist ./dist

EXPOSE 8080

CMD ["node", "dist/main.js"]
