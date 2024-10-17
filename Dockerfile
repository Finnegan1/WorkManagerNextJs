# Step 1: Use an official Node.js runtime as a base image
FROM node:18-alpine

# Step 2: Declare the build argument
ARG TEMPLATES_GITHUB_REPO

# Step 4: Set working directory inside the container
WORKDIR /app

# Step 5: Copy package.json and package-lock.json (or yarn.lock) to the container
COPY package.json package-lock.json ./

# Step 6: Install dependencies
RUN npm install

# Step 7: Copy the rest of the app's source code into the container
COPY . .

# Step 8: Run the build command (use the env variable during the build process)
RUN npm run build

# Step 9: Expose the port
EXPOSE 3000

# Step 10: Command to run the app
CMD ["npm", "start"]
