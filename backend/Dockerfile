FROM node:20-alpine 

# Install netcat for database connection testing
RUN apk add --no-cache netcat-openbsd

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

# Make wait script executable
RUN chmod +x wait-for-db.sh

EXPOSE 5000

CMD ["./wait-for-db.sh", "node", "server.js"]