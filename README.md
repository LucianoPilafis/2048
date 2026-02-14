# 2048 Game - Agent-Driven Development

A 2048 game implementation built with **autonomous agent-driven development** using the ADW (AI Developer Workflows) pattern.

## 🎯 Project Overview

This project demonstrates:
- **Plan → Build → Test** workflow
- Autonomous issue resolution via GitHub issues
- Agent-driven PRs and commits
- Vercel deployment

## 📋 Stack

- **Frontend**: React + TypeScript
- **Build**: Vite
- **Deployment**: Vercel
- **Development**: Agent-driven via ADWs

## 🚀 Getting Started

```bash
npm install
npm run dev
```

## 📚 ADW Commands

Key commands for agent-driven development:

```bash
# Features
claude /feature "Add touch controls"

# Implementation
claude /implement "Implement game logic"

# Testing
claude /test

# Commits
claude /commit

# Full workflow (plan → build → test)
python adws/adw_plan_build_test.py
```

## 📦 Project Structure

```
.
├── .claude/              # Claude Code configuration
│   ├── commands/         # Custom ADW commands
│   ├── hooks/           # Pre/post tool hooks
│   └── settings.json    # Configuration
├── adws/                # AI Developer Workflows
├── src/                 # Source code
│   ├── components/      # React components
│   ├── game/           # Game logic
│   └── App.tsx         # Main component
└── README.md
```

## 🔄 Workflow

Issues are created and automatically resolved by agents following the ADW pattern. Each feature follows:

1. **Plan**: Design and break down the feature
2. **Build**: Implement the changes
3. **Test**: Validate functionality
4. **PR**: Create pull request with evidence

---

*Built with autonomous agents following TAC course principles*
