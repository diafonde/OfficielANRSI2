# Running the Application Locally

## Option 1: Using Development Profile (Recommended)

The application has a `dev` profile configured for local development with PostgreSQL.

### Prerequisites
1. PostgreSQL must be running locally
2. Create a database named `anrsidb` (or update the config)
3. Update credentials in `application-dev.properties` if needed

### Run with Dev Profile

```bash
cd backend-anrsi
./gradlew bootRun --args='--spring.profiles.active=dev'
```

Or set the profile in your IDE:
- Run configuration: `--spring.profiles.active=dev`

## Option 2: Using Environment Variables

Set these environment variables before running:

```bash
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/anrsi
export SPRING_DATASOURCE_USERNAME=postgres
export SPRING_DATASOURCE_PASSWORD=your_password
export SPRING_PROFILES_ACTIVE=prod

./gradlew bootRun
```

## Option 3: Using Docker Compose

Start all services (PostgreSQL + Backend + Frontend):

```bash
cd /Users/mdia/Desktop/Anrsi/OfficielANRSI
docker-compose up
```

This will:
- Start PostgreSQL on port 5432
- Start Backend on port 8080
- Start Frontend on port 80

## Database Setup

If you need to create the database manually:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE anrsidb;

# Or if using existing 'anrsi' database
# Update application-dev.properties to use 'anrsi' instead of 'anrsidb'
```

## Troubleshooting

### Connection Refused
- Check if PostgreSQL is running: `ps aux | grep postgres`
- Verify port: Default is 5432
- Check database exists: `psql -U postgres -l`

### Authentication Failed
- Update username/password in `application-dev.properties`
- Or set environment variables

### Port Already in Use
- Change `server.port` in application properties
- Or kill the process using port 8080

