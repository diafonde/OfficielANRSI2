#!/bin/bash

echo "=== Checking Database Connection Status ==="
echo ""

# Check if app is running
if curl -s http://localhost:8080/actuator/health > /dev/null 2>&1; then
    echo "✓ Application is running"
else
    echo "✗ Application is NOT running on port 8080"
    exit 1
fi

echo ""
echo "Testing API endpoints that require database:"
echo ""

# Test articles endpoint
echo -n "Articles endpoint: "
ARTICLES_RESPONSE=$(curl -s http://localhost:8080/api/articles 2>&1)
if echo "$ARTICLES_RESPONSE" | grep -q "error\|No static resource"; then
    echo "✗ NOT CONNECTED (controllers not loaded)"
    echo "  Response: $ARTICLES_RESPONSE"
else
    echo "✓ CONNECTED"
    echo "  Response: $(echo "$ARTICLES_RESPONSE" | head -c 100)..."
fi

echo ""
echo "=== Solution ==="
echo "The app is running but NOT connected to PostgreSQL."
echo ""
echo "To connect to the database, restart the app with dev profile:"
echo "  ./gradlew bootRun --args='--spring.profiles.active=dev'"
echo ""
echo "Or use the startup script:"
echo "  ./start-dev.sh"
echo ""
echo "Make sure PostgreSQL is running and the 'anrsi' database exists."




