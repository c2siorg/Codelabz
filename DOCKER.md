# Codelabz Docker Setup

This guide explains how to run the CodeLabz application and the Firebase Emulator Suite using Docker.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Setup

### 1. Configure Environment Variables

Ensure you have a `.env` file in the root directory. You can copy the sample:

```bash
cp .env.sample .env
```

Fill in your Firebase credentials in the `.env` file.

### 2. Build and Start

Run the following command to build the image and start the services:

```bash
docker-compose up --build
```

## How to Verify

- **Main Application**: Access the React app at [http://localhost:80](http://localhost:80).
- **Firebase Emulator UI**: View the local database and auth states at [http://localhost:4000](http://localhost:4000).

## Common Commands

- **Stop services**:
  ```bash
  docker-compose down
  ```
- **Stop and remove volumes (clean database)**:
  ```bash
  docker-compose down -v
  ```
- **View logs**:
  ```bash
  docker-compose logs -f
  ```

## Troubleshooting

- **Port in use**: If any port (80, 4000, 8080, etc.) is occupied, ensure no other local services or instances of the Firebase Emulator are running.
- **Vite build failure**: Ensure `npm run build` works locally before building the Docker image.
