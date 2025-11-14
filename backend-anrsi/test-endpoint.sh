#!/bin/bash
# Quick test script to verify the login endpoint is available

echo "Testing /api/auth/login endpoint..."
echo ""

response=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}')

if [ "$response" == "404" ]; then
  echo "❌ Endpoint not found (404) - Backend may not be running with dev profile"
  echo "   Make sure to restart with: ./gradlew bootRun --args='--spring.profiles.active=dev'"
elif [ "$response" == "401" ] || [ "$response" == "400" ]; then
  echo "✅ Endpoint is available! (Got $response - this is expected for invalid credentials)"
  echo "   The AuthController is registered and working."
else
  echo "Response code: $response"
fi



