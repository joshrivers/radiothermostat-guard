FROM node:10

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install && npm cache clean --force
COPY . /usr/src/app

ENV THERMOSTAT_IP unset
ENV POLLING_DELAY 900000
CMD [ "npm", "start" ]