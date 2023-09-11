FROM node:18

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install

# Copy the entire app to the container
COPY . .

# Specify the command to run when the container starts
CMD ["pnpm", "start"]
