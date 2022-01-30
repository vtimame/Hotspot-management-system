FROM node:14-alpine as build

WORKDIR /app

COPY package*.json /app/

RUN npm i

COPY . /app/

RUN npm run build

FROM node:14-alpine as development

WORKDIR /app

COPY --from=build /app /app/

EXPOSE 8080

CMD ["npm", "run", "dev"]

FROM node:14-alpine as production

WORKDIR /app

COPY --from=build /app /app/

EXPOSE 8080

CMD ["npm", "run", "start"]
