FROM node:10-slim

ENV PORT 8888

# npm install
ADD package.json /tmp/package.json
COPY package-lock.json /tmp/package-lock.json
RUN cd /tmp && npm install
RUN mkdir -p /opt/app-root/ && cp -a /tmp/node_modules /opt/app-root/

WORKDIR /opt/app-root/
COPY . .
RUN chmod -R 775 .

EXPOSE 8888

CMD ./wait-for-it.sh mysql:3306 -- npm run start
