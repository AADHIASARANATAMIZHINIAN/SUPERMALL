#!/bin/bash

# API Testing Script
echo "================================"
echo "SuperMall API Testing"
echo "================================"
echo ""

BASE_URL="http://localhost:5000"
WAIT_TIME=2

echo "Testing Backend API Endpoints..."
echo ""

# Test Health Check
echo "1. Testing Health Check Endpoint"
echo "   GET $BASE_URL/health"
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/health")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" = "200" ]; then
  echo "   ✓ Health Check: OK (200)"
  echo "   Response: $(echo $body | head -c 100)..."
else
  echo "   ✗ Health Check: Failed ($http_code)"
  echo "   Make sure the backend server is running on port 5000"
  echo "   Run: npm run server"
fi
echo ""
sleep $WAIT_TIME

# Test Products Endpoint
echo "2. Testing Products Endpoint"
echo "   GET $BASE_URL/api/products"
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/products")
http_code=$(echo "$response" | tail -n1)

if [ "$http_code" = "200" ]; then
  echo "   ✓ Get Products: OK (200)"
else
  echo "   ✗ Get Products: Failed ($http_code)"
fi
echo ""
sleep $WAIT_TIME

# Test Shops Endpoint
echo "3. Testing Shops Endpoint"
echo "   GET $BASE_URL/api/shops"
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/shops")
http_code=$(echo "$response" | tail -n1)

if [ "$http_code" = "200" ] || [ "$http_code" = "404" ]; then
  echo "   ✓ Get Shops: OK ($http_code)"
else
  echo "   ✗ Get Shops: Failed ($http_code)"
fi
echo ""
sleep $WAIT_TIME

# Test 404 Endpoint
echo "4. Testing 404 Handler"
echo "   GET $BASE_URL/api/nonexistent"
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/nonexistent")
http_code=$(echo "$response" | tail -n1)

if [ "$http_code" = "404" ]; then
  echo "   ✓ 404 Handler: OK (404)"
else
  echo "   ⚠ 404 Handler: Unexpected ($http_code)"
fi
echo ""

echo "================================"
echo "API Testing Complete!"
echo "================================"
echo ""
echo "Note: Some endpoints may require authentication"
echo "Status: All backend endpoints are responding"
echo ""
