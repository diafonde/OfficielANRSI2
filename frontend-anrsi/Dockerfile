# Stage 1: Build the Angular application
FROM node:18-alpine AS builder

# Install Angular CLI globally
RUN npm install -g @angular/cli@15

WORKDIR /app

# Copy package files (for dependency caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Build the Angular application for production
# Output goes to dist/demo/ based on angular.json configuration
RUN ng build --configuration production

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built Angular app from builder stage to nginx html directory
COPY --from=builder /app/dist/demo/ /usr/share/nginx/html/

# Copy Nginx configuration (optional - will use default if not present)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx in foreground mode
CMD ["nginx", "-g", "daemon off;"]

