#!/bin/bash

# Backend Health Check Script
echo "================================"
echo "SuperMall Backend Health Check"
echo "================================"
echo ""

# Check if Node.js is installed
echo "✓ Checking Node.js..."
node --version
echo ""

# Check if npm is installed
echo "✓ Checking npm..."
npm --version
echo ""

# Check if required directories exist
echo "✓ Checking directory structure..."
if [ -d "backend" ]; then
  echo "  ✓ backend/ exists"
else
  echo "  ✗ backend/ missing"
fi

if [ -d "frontend" ]; then
  echo "  ✓ frontend/ exists"
else
  echo "  ✗ frontend/ missing"
fi

if [ -d "uploads" ]; then
  echo "  ✓ uploads/ exists"
else
  echo "  ⚠ uploads/ missing (will be created on first upload)"
fi

if [ -d "logs" ]; then
  echo "  ✓ logs/ exists"
else
  echo "  ⚠ logs/ missing (will be created on first run)"
fi

echo ""

# Check .env file
echo "✓ Checking .env configuration..."
if [ -f ".env" ]; then
  echo "  ✓ .env file found"
  echo "  Configuration variables:"
  grep "^[^#]" .env | head -5
  echo "  ..."
else
  echo "  ✗ .env file missing"
fi

echo ""

# Check package.json
echo "✓ Checking package.json..."
if [ -f "package.json" ]; then
  echo "  ✓ package.json found"
  echo "  Main file: $(grep '\"main\"' package.json)"
else
  echo "  ✗ package.json missing"
fi

echo ""

# Check key dependencies
echo "✓ Checking backend dependencies..."
if [ -d "node_modules" ]; then
  if [ -d "node_modules/express" ]; then
    echo "  ✓ Express installed"
  else
    echo "  ✗ Express not found"
  fi
  
  if [ -d "node_modules/mongoose" ]; then
    echo "  ✓ Mongoose installed"
  else
    echo "  ✗ Mongoose not found"
  fi
  
  if [ -d "node_modules/firebase-admin" ]; then
    echo "  ✓ Firebase Admin SDK installed"
  else
    echo "  ✗ Firebase Admin SDK not found"
  fi
else
  echo "  ⚠ node_modules not found (run 'npm install')"
fi

echo ""
echo "================================"
echo "Health Check Complete!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Run 'npm install' if dependencies are missing"
echo "2. Ensure MongoDB is running on localhost:27017"
echo "3. Verify Firebase credentials in .env file"
echo "4. Run 'npm run dev' to start the development server"
echo ""
