FROM node:22.23.0-bullseye-slim AS base

WORKDIR /code

FROM base AS build

COPY --link package*.json ./

RUN npm ci --include=dev

COPY --link . .

RUN npx nuxt prepare && npm run build

FROM base AS runtime

ENV NODE_ENV=production

COPY --from=build /code/.output /code/.output

CMD [ "node", "./.output/server/index.mjs" ]
