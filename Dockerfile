FROM node:16-alpine as builder

WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json prisma ./
RUN npm ci --no-audit --quiet 
# Copy application
COPY . .
# Build Application
RUN npm run build

# Configure runner
FROM node:16-alpine as runner
# Set NODE_ENV to production
ENV NODE_ENV production
WORKDIR /usr/src/app
# Copy built application to runner
COPY --chown=node:node --from=builder /usr/src/app/build ./build
# Copy dependencies to runner
COPY package*.json ./
# Install production (omit devDepencies)
RUN npm ci --no-audit --quiet --omit=dev && npm cache clean --force --quiet
# Copy Prisma Client to runner
COPY --chown=node:node --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma

CMD ["npm", "start"]

EXPOSE 4000