@echo off

echo ================================
echo   Learnatics - Setup Script
echo ================================
echo.

REM Backend Setup
echo Setting up Backend...
cd backend

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Python is not installed. Please install Python 3.8+
    exit /b 1
)

REM Create virtual environment
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing Django dependencies...
pip install -r requirements.txt

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo Creating .env file from example...
    copy .env.example .env
)

REM Run migrations
echo Running database migrations...
python manage.py migrate

REM Create superuser
echo Creating superuser account...
python manage.py createsuperuser

echo.
echo Backend setup complete!
echo.

REM Frontend Setup
echo Setting up Frontend...
cd ..\frontend

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Node.js is not installed. Please install Node.js 14+
    exit /b 1
)

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo Creating .env file from example...
    copy .env.example .env
)

REM Install npm dependencies
echo Installing npm dependencies...
call npm install

echo.
echo ================================
echo   Setup Complete!
echo ================================
echo.
echo To start the application:
echo 1. Terminal 1 - Start Backend:
echo    cd backend
echo    venv\Scripts\activate.bat
echo    python manage.py runserver
echo.
echo 2. Terminal 2 - Start Frontend:
echo    cd frontend
echo    npm start
echo.
echo Then open http://localhost:3000 in your browser
echo.
