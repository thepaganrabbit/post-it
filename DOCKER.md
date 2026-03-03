# Docker Setup for Post-It Project

This project includes a complete Docker-based development and production setup that combines the Next.js frontend, NestJS backend, and MongoDB database into a single, easy-to-manage environment.

## Quick Start

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running
- No need to have Node.js or MongoDB installed locally

### Running the Full Project

From the root directory of the project, run:

```bash
docker-compose up --build
```

This command will:
1. Build the backend container
2. Build the frontend container
3. Start MongoDB
4. Start the backend service
5. Start the frontend service

The services will then be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3002
- **MongoDB**: localhost:27017 (accessible from containers only)

### Stopping the Services

Press `Ctrl+C` in the terminal, or run:

```bash
docker-compose down
```

To also remove volumes (database data):

```bash
docker-compose down -v
```

## Available Commands

### Start services in background
```bash
docker-compose up -d --build
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Execute commands in a running container
```bash
# Backend container
docker-compose exec backend npm test
docker-compose exec backend npm run lint

# Frontend container
docker-compose exec frontend npm test
docker-compose exec frontend npm run lint
```

### Rebuild specific service
```bash
docker-compose build backend
docker-compose build frontend
```

### Remove all containers, networks, and volumes
```bash
docker-compose down -v
```

## Architecture

### Services

#### MongoDB (Database)
- **Image**: mongo:7
- **Port**: 27017 (internal only, exposed for debugging)
- **Credentials**:
  - Username: `admin`
  - Password: `password123`
- **Database**: `postit`
- **Health Check**: Enabled with 5s interval
- **Volumes**: 
  - `mongodb_data`: Stores database files
  - `mongodb_config`: Stores MongoDB configuration

#### Backend (NestJS API)
- **Build**: Multi-stage build for optimized image size
- **Port**: 3002
- **Environment Variables**:
  - `NODE_ENV=production`
  - `DATABASE_HOST=mongodb` (Docker DNS service name)
  - `DATABASE_PORT=27017`
  - `DATABASE_USERNAME=admin`
  - `DATABASE_PASSWORD=password123`
  - `DATABASE_NAME=postit`
- **Dependencies**: Waits for MongoDB to be healthy before starting
- **Development**: Includes volume mounts for hot-reload

#### Frontend (Next.js)
- **Build**: Multi-stage build for optimized image size
- **Port**: 3000
- **Environment Variables**:
  - `NODE_ENV=production`
  - `NEXT_PUBLIC_API_URL=http://localhost:3002` (for accessing backend from browser)
- **Dependencies**: Waits for backend to be running
- **Development**: Includes volume mounts for hot-reload

### Networking

All services communicate through a custom bridge network named `postit-network`. This allows services to reference each other by container name (e.g., `mongodb` instead of IP address).

## Development vs Production

### Development Mode

For development with hot-reload:

1. Install dependencies locally:
   ```bash
   cd postit-back && npm install && cd ..
   cd postit-front && npm install && cd ..
   ```

2. Start services with volume mounts enabled:
   ```bash
   docker-compose up --build
   ```

3. Edit code in your IDE - changes will be reflected in the running containers

### Production Mode

For production deployment:

1. Remove or comment out the `volumes` sections in `docker-compose.yml`
2. Build and run:
   ```bash
   docker-compose up -d --build
   ```

Note: The current `docker-compose.yml` includes volume mounts for development convenience. Remove them for production.

## Environment Configuration

### Backend Environment Variables

The backend reads configuration from the Docker environment variables set in `docker-compose.yml`. To change MongoDB credentials or ports:

1. Edit `docker-compose.yml`
2. Update the `environment` sections for both `mongodb` and `backend` services
3. Rebuild: `docker-compose up --build`

### Frontend Configuration

The frontend uses:
- `NEXT_PUBLIC_API_URL`: Points to the backend API (http://localhost:3002)

To change this for a different backend URL, update the `docker-compose.yml` or create a `.env.production` file in `postit-front/`.

## Troubleshooting

### Services won't start

1. Check logs: `docker-compose logs`
2. Ensure ports 3000, 3002, and 27017 are not in use
3. Make sure `docker-compose.yml` is in the root directory

### MongoDB connection fails

- Verify MongoDB service is running: `docker-compose ps`
- Check MongoDB health: `docker-compose logs mongodb`
- Confirm the `DATABASE_HOST=mongodb` in backend environment variables

### Frontend can't reach backend

- Ensure backend is running: `docker-compose logs backend`
- Check `NEXT_PUBLIC_API_URL` environment variable
- Verify the backend port (3002) is accessible

### Port already in use

If ports 3000, 3002, or 27017 are already in use:

1. Stop other containers: `docker-compose down`
2. Or modify port mappings in `docker-compose.yml`:
   ```yaml
   ports:
     - "3003:3000"  # Maps to different port
   ```

### Clear volumes and restart

To completely reset the database and containers:

```bash
docker-compose down -v
docker-compose up --build
```

## Performance Tips

1. **Exclude unnecessary files** from Docker builds using `.dockerignore`
2. **Use multi-stage builds** (already implemented) to reduce image size
3. **Leverage Docker layer caching** by installing dependencies before copying source code
4. **Limit container resources** if needed in `docker-compose.yml`:
   ```yaml
   services:
     backend:
       deploy:
         resources:
           limits:
             cpus: '0.5'
             memory: 512M
   ```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Docker Documentation](https://hub.docker.com/_/mongo)
