# ============================================
# STAGE 1: BUILD YOUR REACT APP
# ============================================

# Use Node.js version 20 on Alpine Linux as the base, name this stage "build"
FROM node:20-alpine AS build

##  it creates folder called / app inside the container and sets it as the curent directory
WORKDIR /app

# Copy package.json and package-lock.json from your computer to the container
COPY package*.json ./

# Install all dependencies (like npm install but faster and more reliable)
RUN npm ci

# Copy all your project files (src/, public/, etc.) to the container
COPY . .

# Create a variable called BUILD_MODE, default value is "production"
ARG BUILD_MODE=production

# Build your React app (creates optimized files in /app/dist folder)
RUN npm run build -- --mode ${BUILD_MODE}




# ============================================
# STAGE 2: SETUP NGINX TO SERVE YOUR APP
# ============================================

# Start fresh with nginx:alpine image (this already has nginx installed + default config)
FROM nginx:alpine

# Copy the built React files from stage 1's /app/dist to nginx's serving folder
COPY --from=build /app/dist /usr/share/nginx/html

# Create a variable called ENV, default value is "production"
ARG ENV=production

# Copy your nginx config file (nginx.production.conf) to nginx's config folder
# This replaces the default nginx site configuration
COPY nginx.${ENV}.conf /etc/nginx/conf.d/default.conf

# Tell Docker that this container will listen on port 80 (just documentation)
EXPOSE 80

# When container starts, run this command: start nginx in foreground mode
# "daemon off" keeps nginx running (otherwise container would exit immediately)
CMD ["nginx", "-g", "daemon off;"]


## 📊 **Visual Flow:**

##Stage 1 (Build):
##Your code → npm install → npm build → /app/dist (built files)

##Stage 2 (Production):
##nginx:alpine image → copy built files → copy nginx config → ready to run

##When container starts:
##CMD runs → nginx starts → serves your app on port 80 ✅