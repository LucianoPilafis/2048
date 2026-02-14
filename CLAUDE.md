# Claude Code Configuration - 2048 Game

## Project Overview

This is an agent-driven 2048 game built with autonomous development workflows (ADWs). The project follows the **Plan → Build → Test** pattern for all features.

## 🤖 ADW Workflow

All features are developed through autonomous agents using:

1. **Plan Phase** (`adws/adw_plan.py`)
   - Design the feature
   - Break down tasks
   - Identify files to modify

2. **Build Phase** (`adws/adw_build.py`)
   - Implement changes
   - Write code
   - Create commits

3. **Test Phase** (`adws/adw_test.py`)
   - Run tests
   - Validate functionality
   - Fix issues

4. **Full Workflow** (`adws/adw_plan_build_test.py`)
   - Execute all three phases
   - Generate PR
   - Complete issue resolution

## 🔧 Available Commands

### Feature Development
```bash
claude /feature "Feature name"
```
Creates a feature branch and initiates development workflow

### Implementation
```bash
claude /implement "Task description"
```
Implements a specific task or issue

### Testing
```bash
claude /test
```
Runs the test suite

### Bug Fixes
```bash
claude /bug "Bug description"
```
Creates a bug fix workflow

### Code Review
```bash
claude /review
```
Reviews code changes

## 📝 Issue-Driven Development

Issues are created in GitHub with labels:
- `type:feature` - New features
- `type:bug` - Bug fixes
- `type:chore` - Maintenance tasks

Agents resolve issues by:
1. Creating feature branches
2. Implementing changes
3. Running tests
4. Creating PRs with evidence of autonomous work

## 📁 Project Structure

```
.claude/              # Claude Code configuration
├── commands/         # ADW command definitions
├── hooks/           # Pre/post tool automation
└── settings.json    # Configuration

adws/                # AI Developer Workflows
├── adw_plan.py           # Planning workflow
├── adw_build.py          # Build workflow
├── adw_test.py           # Test workflow
├── adw_plan_build_test.py # Full workflow
└── adw_modules/          # Shared utilities

src/                 # Source code
├── components/      # React components
├── game/           # 2048 game logic
└── App.tsx         # Main application

index.html           # Entry point
package.json         # Dependencies
```

## 🚀 Deployment

The app is deployed on Vercel using `vercel.json` configuration:

```bash
npm run build  # Builds to dist/
```

Vercel automatically deploys the `dist/` folder.

## ✅ Development Guidelines

- All features must have GitHub issues
- Use ADW commands for implementation
- Each commit should reference the issue
- PRs are created automatically by agents
- Tests must pass before merging

## 🎮 Game Features

- Classic 2048 gameplay
- Keyboard controls (arrow keys)
- Score tracking
- Win/lose detection
- Responsive design

---

*This project demonstrates autonomous agent-driven development following TAC course principles.*
