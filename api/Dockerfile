FROM node:14-alpine as build

WORKDIR /app

COPY package*.json /app/

RUN apk add --no-cache make gcc g++ python && \
    npm install && \
    npm rebuild bcrypt --build-from-source && \
    apk del make gcc g++ python

COPY . /app/

RUN npm run build

FROM node:14-alpine as development

ENV NODE_ENV=development
WORKDIR /app

COPY --from=build /app /app/

EXPOSE 3000

CMD ["npm", "run", "start:dev"]

FROM node:14-alpine as production

ENV NODE_ENV=production
WORKDIR /app

COPY --from=build /app /app/

EXPOSE 3000

CMD ["npm", "run", "start:prod"]