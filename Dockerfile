FROM node:16-alpine

WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json /usr/src/app/
# Prisma schema
COPY prisma/ /usr/src/app/
RUN npm install

COPY . /usr/src/app

RUN npm run build

CMD ["npm", "start"]

EXPOSE 4000