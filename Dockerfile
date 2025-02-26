# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application files
COPY . .



# Set environment variables using the build-time arguments
ENV PORT=3000
ENV DATABASE="mongodb://localhost:27017/canvas"
ENV JWT_SECRET="changeme"
ENV NODE_ENV ="production"

# Expose the defined port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
