FROM node:20-alpine 

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

EXPOSE 5000

CMD ["./wait-for-db.sh", "node", "server.js"]
