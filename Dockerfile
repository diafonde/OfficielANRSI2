# Root Dockerfile for Backend Deployment
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app

# Copy the entire backend directory
COPY backend-anrsi backend-anrsi/

# Grant execute permission
RUN chmod +x backend-anrsi/gradlew

# Build the application
WORKDIR /app/backend-anrsi
RUN ./gradlew build -x test

# Runtime stage
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the built JAR
COPY --from=builder /app/backend-anrsi/build/libs/*.jar app.jar

# Expose port 8080
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]

