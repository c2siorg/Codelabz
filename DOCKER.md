# Docker Setup Guide for Codelabz

This guide explains how to run Codelabz using Docker for both development and production environments.

## Prerequisites

- Docker Engine 20.10 or higher
- Docker Compose 2.0 or higher
- At least 2GB of available RAM
- At least 5GB of available disk space

## Docker Architecture

### Production Dockerfile (Multi-Stage)

The production `Dockerfile` uses a **2-stage multi-stage build** for optimization:

1. **Stage 1 (Builder)**: Installs Node.js dependencies and builds the React application using Vite
2. **Stage 2 (Production)**: Serves the built app using Nginx Alpine

**Benefits:**
- Small final image size (~30MB vs ~1.2GB)
- No dev dependencies in production
- Optimized Nginx configuration with gzip, caching, and security headers
- Health checks included
- Uses Node 20 LTS Alpine (latest stable)
- Works with legacy peer dependencies

### Development Dockerfile

The `Dockerfile.dev` is designed for local development with Firebase emulators:

- Includes Firebase CLI and emulators
- Supports hot-reloading with volume mounts
- Exposes all necessary ports for development

## Quick Start

### Production Deployment

#### Option 1: Using Docker Compose (Recommended)

```bash
# Build and start the production container
docker compose up -d

# View logs
docker compose logs -f

# Stop the container
docker compose down
```

The application will be available at: **http://localhost**

#### Option 2: Using Docker Commands

```bash
# Build the production image
docker build -t codelabz:production .

# Run the container
docker run -d \
  --name codelabz \
  -p 80:80 \
  --restart unless-stopped \
  codelabz:production

# View logs
docker logs -f codelabz

# Stop and remove the container
docker stop codelabz && docker rm codelabz
```

### Development with Firebase Emulators

#### Using Docker Compose for Development

```bash
# Build and start development container
docker compose -f docker-compose.dev.yml up --build

# View logs
docker compose -f docker-compose.dev.yml logs -f

# Stop the container
docker compose -f docker-compose.dev.yml down
```

#### Using Development Dockerfile Directly

```bash
# Build the development image
docker build -f Dockerfile.dev -t codelabz:dev .

# Run with volume mounts for hot-reloading
docker run -d \
  --name codelabz-dev \
  -p 5173:5173 \
  -p 4000:4000 \
  -p 5000:5000 \
  -p 5001:5001 \
  -p 8080:8080 \
  -p 9000:9000 \
  -p 8085:8085 \
  -p 9099:9099 \
  -p 9199:9199 \
  -p 4400:4400 \
  -v "$(pwd):/app" \
  -v /app/node_modules \
  codelabz:dev
```

**Access Points:**
- Vite Dev Server: http://localhost:5173
- Firebase Emulator UI: http://localhost:4000

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Optional: Firebase Emulator Configuration (Development)
FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
FIRESTORE_EMULATOR_HOST=localhost:8080
```

Pass environment file to Docker:

```bash
docker run --env-file .env -p 80:80 codelabz:production
```

### Custom Nginx Configuration

To use a custom Nginx configuration:

1. Create `nginx.conf` in the project root
2. The Dockerfile will automatically use it if present

Example custom configuration:

```nginx
server {
    listen 80;
    server_name example.com;
    
    location / {
        root /usr/share/nginx/html;
        try_files $uri /index.html;
    }
}
```

## Image Sizes Comparison

| Build Type | Image Size | Build Time |
|-----------|-----------|------------|
| Single-stage (old) | ~1.2 GB | ~3 minutes |
| Multi-stage (new) | ~30 MB | ~2 minutes |

## Advanced Usage

### Build Arguments

You can customize the build process using build arguments:

```bash
# Build with specific Node version
docker build \
  --build-arg NODE_VERSION=20 \
  -t codelabz:custom .
```

### Multi-Platform Builds

Build for multiple architectures (ARM64, AMD64):

```bash
# Enable buildx
docker buildx create --use

# Build for multiple platforms
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t codelabz:multiarch \
  --push .
```

### Optimizing Build Cache

For faster rebuilds during development:

```bash
# Use BuildKit for better caching
DOCKER_BUILDKIT=1 docker build -t codelabz:production .

# With docker compose
DOCKER_BUILDKIT=1 docker compose build
```

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker logs codelabz

# Check health status
docker inspect --format='{{.State.Health.Status}}' codelabz
```

### Port Already in Use

```bash
# Find process using port 80
lsof -i :80  # Linux/Mac
netstat -ano | findstr :80  # Windows

# Use a different port
docker run -p 8080:80 codelabz:production
```

### Build Fails

```bash
# Clean build without cache
docker build --no-cache -t codelabz:production .

# Prune build cache
docker builder prune
```

### High Memory Usage

```bash
# Limit container memory
docker run -m 512m -p 80:80 codelabz:production
```

## Testing the Docker Setup

### Test Production Build Locally

```bash
# Build the image
docker build -t codelabz:test .

# Run on port 8080
docker run -p 8080:80 codelabz:test

# Visit http://localhost:8080
```

### Health Check

```bash
# Check health status
docker inspect codelabz | grep -A 10 Health

# Manual health check
curl -f http://localhost/ || echo "Health check failed"
```

## Production Deployment Checklist

- [ ] Update environment variables in `.env`
- [ ] Configure custom domain in Nginx config
- [ ] Set up SSL/TLS certificates (use reverse proxy like Traefik)
- [ ] Configure logging and monitoring
- [ ] Set up automatic backups
- [ ] Enable HTTPS redirect
- [ ] Configure rate limiting
- [ ] Set up CI/CD pipeline

## Deployment to Cloud Platforms

### Deploy to AWS ECS

```bash
# Push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com
docker tag codelabz:production <account>.dkr.ecr.us-east-1.amazonaws.com/codelabz:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/codelabz:latest
```

### Deploy to Google Cloud Run

```bash
# Submit to Cloud Build
gcloud builds submit --tag gcr.io/<project-id>/codelabz

# Deploy to Cloud Run
gcloud run deploy codelabz \
  --image gcr.io/<project-id>/codelabz \
  --platform managed \
  --port 80
```

### Deploy to Azure Container Instances

```bash
# Login to Azure
az acr login --name <registry-name>

# Tag and push
docker tag codelabz:production <registry-name>.azurecr.io/codelabz:latest
docker push <registry-name>.azurecr.io/codelabz:latest

# Deploy
az container create \
  --resource-group codelabz-rg \
  --name codelabz \
  --image <registry-name>.azurecr.io/codelabz:latest \
  --ports 80
```

## Best Practices

1. **Always use multi-stage builds** for production
2. **Leverage .dockerignore** to reduce build context
3. **Use specific version tags** instead of `latest`
4. **Implement health checks** for production containers
5. **Use Docker Compose** for easier orchestration
6. **Set resource limits** to prevent resource exhaustion
7. **Regularly update base images** for security patches
8. **Use volumes** for persistent data
9. **Enable logging** with proper log drivers
10. **Scan images** for vulnerabilities before deployment

## Security Considerations

- Images are built with Node 20 Alpine (minimal attack surface)
- No dev dependencies in production
- Security headers configured in Nginx
- Health checks prevent unhealthy containers
- Non-root user can be added for additional security

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Vite Docker Guide](https://vitejs.dev/guide/static-deploy.html#docker)
- [Nginx Docker Official Image](https://hub.docker.com/_/nginx)
- [Docker Security Best Practices](https://docs.docker.com/engine/security/)

## Tips for Development

- Use volume mounts for hot-reloading
- Keep Firebase emulator data with volumes
- Use Docker Compose for easier management
- Monitor container logs regularly
- Clean up unused images and containers

```bash
# Remove unused Docker resources
docker system prune -a
```

---

**Need Help?** Check the [CONTRIBUTING.md](CONTRIBUTING.md) for more information or open an issue on GitHub.
