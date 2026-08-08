# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN CYPRESS_INSTALL_BINARY=0 npm install --legacy-peer-deps

COPY . .

RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS production

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
