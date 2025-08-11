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

In **NestJS**, you usually use **TypeORM** or **Prisma** for models and migrations.
Here’s a short example for **TypeORM**:

1. **Create a model (entity)**:

```bash
npx typeorm entity:create src/models/websites-analysis/WebsiteAnalysis
```

2. **Create a migration**:

```bash
npx typeorm migration:create src/migrations/CreateWebsiteAnalysis
```

3. **Generate a migration from model changes**:

```bash
npx typeorm migration:generate src/migrations/AutoMigration -d src/data-source.ts
```

4. **Run migrations**:

```bash
npx typeorm migration:run
```

5. **Revert the last migration**:

```bash
npx typeorm migration:revert
```

```
docker compose up -d
```

```
npm run start dev
```

```
npm run migration:run
```
