FROM node:16.13-buster
RUN mkdir -p /home/node/app
WORKDIR /home/node/app
COPY package.json package.json
RUN yarn install
CMD yarn develop