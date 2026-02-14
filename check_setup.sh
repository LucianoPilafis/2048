#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Checking 2048 Game ADW Setup..."
echo ""

# Function to check command
check_command() {
    if command -v "$1" &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 is installed"
        return 0
    else
        echo -e "${RED}✗${NC} $1 is NOT installed"
        return 1
    fi
}

# Function to check env var
check_env() {
    if [ -z "${!1}" ]; then
        echo -e "${RED}✗${NC} $1 is NOT set"
        return 1
    else
        echo -e "${GREEN}✓${NC} $1 is set"
        return 0
    fi
}

FAILED=0

echo "📋 System Tools:"
check_command "git" || FAILED=1
check_command "uv" || FAILED=1
check_command "claude" || FAILED=1
check_command "gh" || FAILED=1
check_command "node" || FAILED=1
check_command "npm" || FAILED=1

echo ""
echo "🐍 Python Dependencies:"
python3 -c "import pydantic" 2>/dev/null && echo -e "${GREEN}✓${NC} pydantic is installed" || { echo -e "${RED}✗${NC} pydantic is NOT installed"; FAILED=1; }
python3 -c "import dotenv" 2>/dev/null && echo -e "${GREEN}✓${NC} python-dotenv is installed" || { echo -e "${RED}✗${NC} python-dotenv is NOT installed"; FAILED=1; }

echo ""
echo "🔐 Environment Variables:"
if [ -f .env ]; then
    source .env
    check_env "ANTHROPIC_API_KEY" || FAILED=1
else
    echo -e "${YELLOW}⚠${NC}  .env file not found (copy from .env.sample)"
    FAILED=1
fi

echo ""
echo "📦 Node Modules:"
if [ -d node_modules ]; then
    echo -e "${GREEN}✓${NC} node_modules exists"
else
    echo -e "${YELLOW}⚠${NC}  node_modules not found (run: npm install)"
fi

echo ""
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed!${NC}"
    echo ""
    echo "Ready to start development:"
    echo "  npm run dev"
    echo ""
    echo "Ready for ADW workflows:"
    echo "  uv run adws/adw_plan_build.py <issue-number>"
else
    echo -e "${RED}❌ Some checks failed${NC}"
    echo ""
    echo "See SETUP.md for installation instructions"
fi
