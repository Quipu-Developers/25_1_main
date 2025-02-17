# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

# ARG NODE_VERSION=23.4.0
ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-alpine

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

COPY . .
#COPY package.json package-lock.json /backend/
RUN if [ "$NODE_ENV" = "production" ]; then npm ci --omit=dev; else npm install; fi


# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.

# COPY package*.json ./


# Copy the rest of the source files into the image.

# Run the application as a non-root user.
# USER node


# Run the application.
#CMD node app.js
 CMD ["node", "src/app.js"]
