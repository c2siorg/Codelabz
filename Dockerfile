FROM node:18

# Set the working directory in the container
WORKDIR /app

# Install JDK 21 (required by firebase-tools for emulators)
RUN apt update -y && apt install -y wget apt-transport-https gnupg bash && \
    wget -O - https://packages.adoptium.net/artifactory/api/gpg/key/public | apt-key add - && \
    echo "deb https://packages.adoptium.net/artifactory/deb $(awk -F= '/^VERSION_CODENAME/{print $2}' /etc/os-release) main" | tee /etc/apt/sources.list.d/adoptium.list && \
    apt update -y && apt install -y temurin-21-jdk

RUN npm install -g firebase-tools

# Pre-download emulators
RUN firebase setup:emulators:firestore && \
    firebase setup:emulators:storage && \
    firebase setup:emulators:database && \
    firebase setup:emulators:pubsub && \
    firebase setup:emulators:ui

# Copy package.json and package-lock.json to the container
COPY package*.json ./
COPY ./functions/package*.json ./functions/

# Install the project dependencies
RUN npm install --legacy-peer-deps
RUN cd functions && npm install --legacy-peer-deps && cd ..

# Copy the entire project directory to the container
COPY . .

# Expose the desired ports
EXPOSE 5173
EXPOSE 4000
EXPOSE 5000
EXPOSE 5001
EXPOSE 8080
EXPOSE 9000
EXPOSE 8085
EXPOSE 9199
EXPOSE 4400
EXPOSE 9099

RUN mkdir -p scripts
RUN printf '#!/bin/sh\nfirebase emulators:start --import=testdata --project codelabz-local-test &\nsleep 15\nnpm run dev -- --host &\nwait\n' > ./scripts/entrypoint.sh
RUN chmod +x ./scripts/entrypoint.sh

CMD ["./scripts/entrypoint.sh"]
