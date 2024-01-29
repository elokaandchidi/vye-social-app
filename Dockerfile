# Install system dependencies
FROM node:18-alpine  as userinterface
WORKDIR /deploy/

# Install nodejs dependencies
COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install

# Copy and generate the static html
COPY . .
RUN npm run build

# Install system dependencies
FROM nginx:alpine as frontend


# Copy the build output from the previous stage
COPY --from=userinterface /deploy/build /usr/share/nginx/html/.

