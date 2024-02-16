FROM node:20.10.0-bullseye-slim AS base

ENV NODE_ENV=production

WORKDIR /code

FROM base as build

COPY --link package*.json ./

RUN npm install --production=false

COPY --link . .

RUN npm run build && npm prune

FROM base

COPY --from=build /code/.output /code/.output

CMD [ "node", "./.output/server/index.mjs" ]
