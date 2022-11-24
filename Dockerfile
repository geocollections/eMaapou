FROM node:16.18.0-alpine as build


# create destination directory
RUN mkdir -p /usr/src/ema
WORKDIR /usr/src/ema

# update and install dependency
# RUN apk update && apk upgrade
# RUN apk add git
# RUN apk add --no-cache --virtual .gyp python3 make g++

COPY package*.json ./
RUN npm ci

COPY . .


RUN npm run build
# copy the app, note .dockerignore
# COPY . /usr/src/ema/
# RUN npm install

# RUN apk del .gyp

# build necessary, even if no static files are needed,
# since it builds the server as well
# RUN npm run build
FROM build AS prod
# expose 5000 on container
EXPOSE 5000
COPY --from=build /usr/src/ema/.nuxt/ /usr/src/ema/.nuxt/
# set app serving to permissive / assigned
ENV NODE_ENV production
ENV NUXT_HOST=0.0.0.0
# set app port
ENV NUXT_PORT=5000

# Bundle app source
COPY . /usr/src/app
# Installing needed packages only and clearing cache
RUN npm ci --only=production && \
    npm cache clean --force

# start the app
CMD [ "npm", "start" ]
