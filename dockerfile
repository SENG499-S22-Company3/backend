FROM node

WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
RUN npm start

CMD npm start

EXPOSE 4000