
FROM node:18-alpine
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "yarn.lock", "./"]

RUN yarn

COPY . .

# Todo multi-stage build
RUN yarn run build

CMD [ "yarn", "run", "start" ]