# Requirements for Running Learnatics

## System Requirements

### Operating System
- Windows 7 or higher
- macOS 10.12 or higher
- Ubuntu 16.04 or higher (or any modern Linux)

### Hardware
- Processor: Intel i5 or equivalent
- RAM: 4GB minimum (8GB recommended)
- Storage: 2GB free space

## Software Requirements

### Required Software

#### 1. Python 3.8+
- **Windows**: Download from [python.org](https://www.python.org/downloads/)
- **macOS**: `brew install python3` or from [python.org](https://www.python.org/downloads/)
- **Linux**: `sudo apt-get install python3 python3-pip python3-venv`

**Verify:**
```bash
python --version
```

#### 2. Node.js 14+ (includes npm)
- Download from [nodejs.org](https://nodejs.org/)
- Includes npm package manager

**Verify:**
```bash
node --version
npm --version
```

#### 3. Git (Optional, for version control)
- Download from [git-scm.com](https://git-scm.com/)
- **Windows**: [Git for Windows](https://git-scm.com/download/win)
- **macOS**: `brew install git`
- **Linux**: `sudo apt-get install git`

**Verify:**
```bash
git --version
```

### Optional but Recommended

#### 1. PostgreSQL (for production)
- Better than SQLite for production
- Download from [postgresql.org](https://www.postgresql.org/download/)

#### 2. Docker & Docker Compose (for containerization)
- Download from [docker.com](https://www.docker.com/products/docker-desktop)
- Includes Docker Compose for multi-container apps

#### 3. Code Editor
- **Visual Studio Code** (Recommended): [code.visualstudio.com](https://code.visualstudio.com/)
- **PyCharm**: For Python development
- **WebStorm**: For JavaScript/React development

#### 4. Postman (for API testing)
- Download from [postman.com](https://www.postman.com/)

## Dependencies

### Backend Dependencies (Python)

All specified in `backend/requirements.txt`:

```
Django==4.2.11
djangorestframework==3.14.0
django-cors-headers==4.3.1
python-decouple==3.8
Pillow==10.1.0
psycopg2-binary==2.9.9
gunicorn==21.2.0
celery==5.3.4
redis==5.0.1
django-filter==23.5
drf-spectacular==0.26.5
django-extensions==3.2.3
whitenoise==6.6.0
python-dateutil==2.8.2
cryptography==41.0.7
```

Installed with: `pip install -r requirements.txt`

### Frontend Dependencies (Node.js)

All specified in `frontend/package.json`:

```
react 18.2.0
react-dom 18.2.0
react-router-dom 6.20.0
axios 1.6.2
react-icons 5.0.1
framer-motion 10.16.4
recharts 2.10.3
zustand 4.4.6
react-toastify 10.0.0
date-fns 2.30.0
tailwindcss 3.3.6
postcss 8.4.31
autoprefixer 10.4.16
```

Installed with: `npm install`

## Installation Steps

### Step 1: Verify Requirements
```bash
# Check Python
python --version

# Check Node.js
node --version
npm --version
```

### Step 2: Clone Repository
```bash
git clone <repository-url>
cd Leanatics
```

### Step 3: Backend Setup
```bash
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 4: Frontend Setup
```bash
cd ../frontend
npm install
```

## Ports Used

- **Frontend**: 3000 (React development server)
- **Backend API**: 8000 (Django development server)
- **PostgreSQL**: 5432 (if using Docker)

**Ensure these ports are available or configure different ones.**

## Network Requirements

- Internet connection for:
  - Installing packages (npm, pip)
  - Downloading fonts (Google Fonts)
  - API calls (if connecting to external services)

## Minimum Development Environment

```
Total Installation Size:
- Python + venv + dependencies: ~500MB
- Node modules: ~300MB
- Repository code: ~50MB
- Database: ~10MB (SQLite)

Total: ~860MB
```

## Browser Requirements

- Modern browser supporting ES6+:
  - Chrome 60+
  - Firefox 60+
  - Safari 12+
  - Edge 79+

## Recommended Development Environment

### Windows
- OS: Windows 10 or 11
- Python: 3.10+ from Microsoft Store or python.org
- Node.js: LTS version
- Terminal: PowerShell or Windows Terminal
- Editor: Visual Studio Code

### macOS
- OS: macOS 11.0+
- Python: via Homebrew or python.org
- Node.js: via Homebrew or nodejs.org
- Terminal: zsh (default) or iTerm2
- Editor: Visual Studio Code

### Linux
- OS: Ubuntu 20.04 LTS or equivalent
- Python: 3.10+ via apt
- Node.js: via apt or NodeSource repository
- Terminal: bash or zsh
- Editor: Visual Studio Code

## Verification Checklist

After installation, verify:

- [ ] Python installed: `python --version`
- [ ] Pip working: `pip --version`
- [ ] Virtual environment created: `python -m venv test`
- [ ] Node.js installed: `node --version`
- [ ] npm installed: `npm --version`
- [ ] Git installed (optional): `git --version`
- [ ] Backend dependencies installed: `pip list`
- [ ] Frontend dependencies installed: `npm list` (in frontend folder)
- [ ] Ports 3000 and 8000 available
- [ ] Browser supports modern JavaScript

## Troubleshooting Installation

### Python Issues
```bash
# If python not found
python3 --version

# If pip fails
python -m pip install --upgrade pip
```

### Node Issues
```bash
# Clear npm cache
npm cache clean --force

# Clear node modules
rm -rf node_modules
npm install
```

### Permission Issues (Linux/Mac)
```bash
# May need sudo for system-wide installations
sudo apt-get install python3-pip
```

### Port Already in Use
- Close other applications using ports 3000 or 8000
- Or change ports in configuration files

## Next Steps After Installation

1. Read [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed setup
2. Read [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for common commands
3. Check [README.md](README.md) for project overview
4. Review [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API details

## Support

If you encounter issues:
1. Check error messages carefully
2. Review troubleshooting section
3. Check documentation files
4. Verify all requirements are installed
5. Check internet connection
6. Try running setup scripts

---

**Last Updated**: January 2026
**Tested On**: Windows 10/11, macOS 12+, Ubuntu 20.04+
