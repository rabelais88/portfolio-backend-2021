FROM node:16.13-buster
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait
RUN mkdir -p /home/node/app
WORKDIR /home/node/app
COPY package.json package.json
# COPY yarn.lock yarn.lock
RUN yarn install
CMD /wait && yarn develop