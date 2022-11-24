FROM node:16.18.0-alpine AS build-stage

# create destination directory
RUN mkdir -p /src
WORKDIR /src

COPY package*.json ./
RUN npm ci && npm cache clean --force

COPY . .

RUN npx nuxt build --standalone

FROM node:16.18.0-alpine

WORKDIR /app
COPY --from=build-stage /src/.nuxt /app/.nuxt
COPY --from=build-stage /src/nuxt.config.ts /app/
COPY --from=build-stage /src/static /app/

RUN npm install "nuxt-start@2.15.8"
# COPY package*.json ./
# RUN npm ci --only=production && npm cache clean --force
# set app serving to permissive / assigned
ENV NUXT_HOST=0.0.0.0
# set app port
ENV NUXT_PORT=5000

# start the app
CMD [ "npx", "nuxt-start" ]
# expose 5000 on container
EXPOSE 5000
