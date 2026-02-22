FROM node:20 AS builder
WORKDIR /src
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build 
FROM node:20
WORKDIR /src
COPY --from=builder /src ./
EXPOSE 3000
CMD ["npm", "start"]