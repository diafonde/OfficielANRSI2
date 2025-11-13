#!/bin/bash

# Start the application with dev profile
# This enables database connection for local development

echo "Starting ANRSI Backend with dev profile..."
echo "Make sure PostgreSQL is running and the 'anrsi' database exists"
echo ""

cd "$(dirname "$0")"

./gradlew bootRun --args='--spring.profiles.active=dev'

