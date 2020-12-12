FROM node:12

# Install yarn
RUN apt-get update && apt-get install -y apt-transport-https
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install yarn --yes

# Install app
WORKDIR /usr/src/app

COPY . .

RUN yarn install --frozen-lockfile
RUN yarn workspace maumau-client build

WORKDIR ./packages/maumau-server

ENV NODE_ENV production
ENV PATH /usr/src/app/node_modules/.bin:$PATH

ENV TS_NODE_TRANSPILE_ONLY 1

EXPOSE 8080

CMD [ "node", "-r", "ts-node/register", "./src/server/main.ts"]
