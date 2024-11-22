FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./

RUN npm install

COPY . .

# Build the project (e.g., transpile TypeScript to JavaScript)
RUN npm run build

# Define the command to start the application
CMD ["npm", "run", "start"]
