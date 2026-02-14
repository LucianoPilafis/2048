# Setup Guide for ADW 2048 Game Project

## Prerequisites

### System Tools Required

1. **uv** - Python script runner (required for ADW workflows)
   ```bash
   curl -LsSf https://astral.sh/uv/install.sh | sh
   ```

2. **Claude Code CLI** - For agent-driven development
   ```bash
   npm install -g @anthropic-ai/claude-code
   # or use: pipx install anthropic-claude-code
   ```

3. **GitHub CLI (gh)** - For GitHub operations
   ```bash
   # macOS
   brew install gh

   # Ubuntu/Debian
   sudo apt install gh

   # Then authenticate
   gh auth login
   ```

4. **Git** - Version control
   ```bash
   # Most systems have it already
   git --version
   ```

5. **Node.js & npm** - For the 2048 game
   ```bash
   # Check if installed
   node --version && npm --version

   # Install from https://nodejs.org/ if needed
   ```

### Python Dependencies

The ADW workflows use embedded dependencies (via `uv`), but you can also install them:

```bash
pip install python-dotenv pydantic
```

## Environment Setup

### 1. Create `.env` file

Copy `.env.sample` to `.env` and fill in your values:

```bash
cp .env.sample .env
```

### 2. Configure Required Variables

**ANTHROPIC_API_KEY** (REQUIRED)
```bash
# Get your API key from: https://console.anthropic.com/account/keys
# Then add to .env:
export ANTHROPIC_API_KEY="sk-ant-..."
```

**GITHUB_PAT** (Optional but recommended)
```bash
# Create a Personal Access Token at: https://github.com/settings/tokens
# Scopes needed: repo, workflow, read:org
export GITHUB_PAT="ghp_..."
```

**CLAUDE_CODE_PATH** (Optional)
```bash
# Only needed if 'claude' command is not in PATH
which claude  # Get the full path and add to .env
```

### 3. GitHub Setup

Initialize your local repo as a GitHub repository:

```bash
# Create a new GitHub repo at https://github.com/new
# Then connect your local repo:
git remote add origin https://github.com/YOUR_USERNAME/2048-game.git
git branch -M main
git push -u origin main

# Or if you already have it:
git remote set-url origin https://github.com/YOUR_USERNAME/2048-game.git
```

## Installation

### Node.js Dependencies

```bash
npm install
```

### Development

```bash
# Start dev server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

## ADW Workflow Usage

### Running Plan + Build

The core workflow that chains planning and implementation:

```bash
# Run plan and build for issue #1
uv run adws/adw_plan_build.py 1

# With specific ADW ID
uv run adws/adw_plan_build.py 1 abc12345
```

### What This Does

1. **Plan Phase** (`adw_plan.py`)
   - Fetches GitHub issue
   - Classifies issue type
   - Creates feature branch
   - Generates implementation plan
   - Commits plan
   - Creates PR

2. **Build Phase** (`adw_build.py`)
   - Loads existing plan
   - Implements solution
   - Commits implementation
   - Updates PR

### Creating Issues

Create GitHub issues for features:

```bash
gh issue create --title "Add touch controls" --body "Implement touch/swipe controls for mobile"
```

Then run ADW workflow:

```bash
uv run adws/adw_plan_build.py <issue-number>
```

## Verification

### Check Claude Code Installation

```bash
claude --version
```

Expected output: `Claude Code version X.X.X`

### Check Python Dependencies

```bash
python3 -c "import pydantic, dotenv; print('All dependencies installed')"
```

### Check GitHub Authentication

```bash
gh auth status
```

### Test ADW Workflow

```bash
# This will create a test ADW session but won't require a real issue
uv run adws/adw_plan.py --help
```

## Troubleshooting

### "claude command not found"

```bash
# Find where it's installed
which claude

# Add full path to .env
echo "CLAUDE_CODE_PATH=/usr/local/bin/claude" >> .env
```

### "No module named 'pydantic'"

```bash
# Install dependencies
pip install python-dotenv pydantic

# Or use uv directly (it handles dependencies automatically)
uv run adws/adw_plan_build.py 1
```

### "ANTHROPIC_API_KEY not set"

```bash
# Set in .env file
echo "ANTHROPIC_API_KEY=sk-ant-your-key-here" >> .env

# Or set temporarily
export ANTHROPIC_API_KEY="sk-ant-..."
```

### GitHub authentication fails

```bash
# Re-authenticate with gh
gh auth logout
gh auth login

# Choose: GitHub.com
# Choose: HTTPS
# Choose: Authenticate with a token
# Paste your GitHub PAT
```

## Next Steps

1. ✅ Install all prerequisites
2. ✅ Create `.env` file with API keys
3. ✅ Set up GitHub repository
4. ✅ Run `npm install` for Node dependencies
5. 🎮 Create first GitHub issue
6. 🤖 Run ADW workflow: `uv run adws/adw_plan_build.py <issue-number>`
7. 🚀 Review PR and deploy to Vercel

## Architecture

```
├── adws/                 # AI Developer Workflows
│   ├── adw_plan_build.py # Plan + Build workflow (main entry)
│   ├── adw_plan.py       # Planning phase
│   ├── adw_build.py      # Implementation phase
│   └── adw_modules/      # Shared utilities
│
├── .claude/              # Claude Code configuration
│   ├── commands/         # Custom slash commands
│   ├── hooks/           # Automation hooks
│   └── settings.json    # Configuration
│
├── src/                  # Application code
│   ├── game/            # 2048 game logic
│   ├── components/      # React components
│   └── App.tsx
│
└── .env                  # Environment variables (create from .env.sample)
```

---

**Ready to develop?** Start with:
```bash
npm run dev
```

**Ready for agent-driven development?** Start with:
```bash
gh issue create --title "Your feature"
uv run adws/adw_plan_build.py 1
```
