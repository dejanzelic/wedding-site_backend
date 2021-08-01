FROM node:lts-alpine as dev

WORKDIR /app
COPY ./app/package.json .
RUN npm install
COPY /app .
EXPOSE 3000
USER node

CMD [ "npm", "run", "startDev" ]

FROM node:lts-alpine as prod

ENV NODE_ENV production
WORKDIR /app
COPY /app .
RUN chown node:node /app/logs/
RUN npm ci --only=production
RUN apk add dumb-init
EXPOSE 3000
USER node

CMD ["dumb-init", "node", "/app/bin/www"]