FROM node:16.18.0-bullseye-slim AS build-stage

# create destination directory
RUN mkdir -p /src
WORKDIR /src

COPY package*.json ./
RUN npm ci && npm cache clean --force

COPY . .

RUN npm run build
RUN rm -Rf node_modules

FROM node:16.18.0-bullseye-slim AS production-stage

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build-stage /src/ .

# set app serving to permissive / assigned
ENV NUXT_HOST=0.0.0.0
# set app port
ENV NUXT_PORT=5000

# start the app
CMD [ "npm", "start" ]
# expose 5000 on container
EXPOSE 5000
