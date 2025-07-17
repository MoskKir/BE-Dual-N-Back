# Deploy PostgreSQL with Docker Compose

1. Create and configure the `.env` file:
   ```sh
   cp .env.example .env
   # Edit the .env file with your settings
   ```

2. Start the services:
   ```sh
   docker compose up -d
   ```

3. To stop and remove the containers:
   ```sh
   docker compose down
   ```

## Files

- `docker-compose.yml`: Docker Compose configuration for PostgreSQL.
- `.env`: Your configuration settings.
- `.env.example`: Example configuration file.
