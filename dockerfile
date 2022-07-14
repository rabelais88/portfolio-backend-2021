FROM node:16.13-buster
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN npm i --global pnpm@7.5.2
RUN chmod +x /wait
RUN mkdir -p /home/node/app
WORKDIR /home/node/app
COPY .npmrc package.json ./
RUN pnpm install
CMD /wait && pnpm develop