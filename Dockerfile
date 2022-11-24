FROM node:16.18.0-alpine

# create destination directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
RUN chown node:node ./
USER node

COPY package*.json ./
RUN npm ci && npm cache clean -force

COPY . .

RUN npm run build

# expose 5000 on container
EXPOSE 5000

# set app serving to permissive / assigned
ENV NUXT_HOST=0.0.0.0
# set app port
ENV NUXT_PORT=5000

# start the app
CMD [ "npm", "start" ]
