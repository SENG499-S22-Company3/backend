FROM node:16-alpine

WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app
RUN npm install

COPY . /usr/src/app
RUN npm run build
#RUN npm start

CMD ["npm", "start"]

EXPOSE 4000