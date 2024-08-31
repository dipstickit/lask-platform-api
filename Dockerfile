# Use the official Node.js image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application
COPY . .

# Build the application
RUN npm run build

# Expose the application port
EXPOSE 8000

# Start the application
CMD ["npm", "run", "start:prod"]
