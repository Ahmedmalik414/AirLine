# ==========================================
# Build Stage
# ==========================================
# Use a Node image to build the React application
FROM node:22-alpine as build-stage

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (better caching)
COPY package*.json ./

# Install dependencies using npm install (or npm ci)
RUN npm install

# Copy the rest of your frontend source code
COPY . .

# Build the Vite project for production
# This creates static files in the /app/dist folder
RUN npm run build

# ==========================================
# Production Stage
# ==========================================
# Use a lightweight Nginx image to serve the static files
FROM nginx:alpine as production-stage

# Copy the completely built static files from the build-stage
# Vite outputs to 'dist' by default, if yours uses 'build', change it below.
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy our custom Nginx configuration to handle React Router routes
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (the default Nginx port)
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
