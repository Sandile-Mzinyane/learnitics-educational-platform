#!/bin/bash

echo "================================"
echo "  Learnatics - Setup Script"
echo "================================"
echo ""

# Backend Setup
echo "Setting up Backend..."
cd backend

# Check if Python is installed
if ! command -v python &> /dev/null
then
    echo "Python is not installed. Please install Python 3.8+"
    exit 1
fi

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
if [ -f "venv/Scripts/activate" ]; then
    source venv/Scripts/activate  # Windows
else
    source venv/bin/activate      # Linux/Mac
fi

# Install dependencies
echo "Installing Django dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file from example..."
    cp .env.example .env
fi

# Run migrations
echo "Running database migrations..."
python manage.py migrate

# Create superuser
echo "Creating superuser account..."
python manage.py createsuperuser

echo ""
echo "Backend setup complete!"
echo ""

# Frontend Setup
echo "Setting up Frontend..."
cd ../frontend

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "Node.js is not installed. Please install Node.js 14+"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file from example..."
    cp .env.example .env
fi

# Install npm dependencies
echo "Installing npm dependencies..."
npm install

echo ""
echo "================================"
echo "  Setup Complete!"
echo "================================"
echo ""
echo "To start the application:"
echo "1. Terminal 1 - Start Backend:"
echo "   cd backend"
echo "   source venv/bin/activate  # or venv\\Scripts\\activate on Windows"
echo "   python manage.py runserver"
echo ""
echo "2. Terminal 2 - Start Frontend:"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "Then open http://localhost:3000 in your browser"
echo ""
