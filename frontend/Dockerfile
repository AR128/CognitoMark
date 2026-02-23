FROM node:24.12.0 AS builder
WORKDIR /src
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build 
FROM node:24.12.0
WORKDIR /src
COPY --from=builder /src ./
EXPOSE 3000
CMD ["npm", "start"]