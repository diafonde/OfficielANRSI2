# Stage 1: Build the application
FROM openjdk:17-jdk-slim AS builder

WORKDIR /app

# Copy Gradle wrapper files
COPY gradlew .
COPY gradle/ gradle/

# Grant execute permission to gradlew
RUN chmod +x ./gradlew

# Copy Gradle configuration files
COPY build.gradle .
COPY settings.gradle .

# Copy source code
COPY src ./src

# Build the application (skip tests for faster builds)
RUN ./gradlew build -x test

# Stage 2: Runtime image
FROM openjdk:17-jre-slim

WORKDIR /app

# Copy the built JAR from builder stage
COPY --from=builder /app/build/libs/*.jar app.jar

# Expose port 8080 (default Spring Boot port)
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]

