# Use the official Node.js image as the base image
FROM node:14.17-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the Angular app for production
RUN npm run build --prod

# Set the command to run the Angular app (change "ng serve" to your production command)
CMD ["npm", "start"]