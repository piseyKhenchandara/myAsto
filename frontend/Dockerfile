FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Add build argument to control which .env file vite uses
ARG BUILD_MODE=production
RUN npm run build -- --mode ${BUILD_MODE}

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Default to production, but allow override
ARG ENV=production
COPY nginx.${ENV}.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]