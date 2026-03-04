FROM node:20-alpine

WORKDIR /app

# Install orchestrator dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy orchestrator source
COPY . .

# Build orchestrator (compiles server.ts → dist/server.js)
RUN npm run build

ENV NODE_ENV=production
EXPOSE 5050

CMD ["npm", "start"]
