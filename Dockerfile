FROM node:14

# Set the working directory in the container
WORKDIR /app

RUN apt update -y && apt install -y openjdk-11-jdk bash

RUN npm install -g firebase-tools@11

# Pre-download emulators
RUN firebase setup:emulators:firestore && \
    firebase setup:emulators:auth && \
    firebase setup:emulators:database && \
    firebase setup:emulators:pubsub && \
    firebase setup:emulators:ui

# Copy package.json and package-lock.json to the container
COPY package*.json ./
COPY ./functions/package*.json ./functions/

# Install the project dependencies
RUN npm install
RUN cd functions && npm install && cd ..

# Copy the entire project directory to the container
COPY . .

# Expose the desired port for the Node.js server
EXPOSE 5173
EXPOSE 4000
EXPOSE 5000
EXPOSE 5001
EXPOSE 8080
EXPOSE 9000
EXPOSE 8085
EXPOSE 9199
EXPOSE 4400

RUN mkdir scripts
RUN echo '#!/bin/sh \nfirebase emulators:start --import=testdata --project demo-sampark &\nsleep 10\nnpm run dev --host &\nwait' > ./scripts/entrypoint.sh 
RUN chmod +x ./scripts/entrypoint.sh

CMD ["./scripts/entrypoint.sh"]
