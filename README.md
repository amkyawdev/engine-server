# Engine Server 🚀

AI Agent Engine Server with skills, tools, and reasoning capabilities. A production-ready backend system for building intelligent AI agents with dynamic skill loading, tool execution, and advanced reasoning engines.

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **Reasoning Engine** | Chain-of-thought, tree-of-thought, and state-machine reasoning strategies |
| 🛠️ **Tool System** | Extensible tool registry with built-in calculator, datetime, and custom tools |
| 📦 **Skill System** | Dynamic skill loading, matching, and compilation from Markdown files |
| 🔌 **Plugin Architecture** | Hook-based plugin system for extensibility |
| 💾 **Memory Management** | Session-based memory with vector search support and caching |
| 🔄 **WebSocket Support** | Real-time streaming, events, and room-based communication |
| 🔒 **Security** | Shell whitelist, permission system, rate limiting |
| 🌐 **RESTful API** | Full API for agent execution, streaming, status, and management |
| 📊 **Observability** | Metrics collection, audit logging, and monitoring |

## 🏗️ Project Structure

```
engine-server/
├── src/
│   ├── core/                    # Core engine modules
│   │   ├── scripter/           # Script parser, executor, validator
│   │   ├── reasoning/          # Reasoning engines (CoT, ToT, State Machine)
│   │   ├── memory/             # Memory, caching, context building
│   │   ├── tools/              # Tool registry and built-in tools
│   │   ├── skills/             # Skill loading, matching, compilation
│   │   ├── plugins/            # Plugin loader and hooks
│   │   └── error-handler/      # Error handling with retry/fallback
│   │
│   ├── adapters/               # Interface adapters
│   │   ├── shell/              # Shell execution with sandboxing
│   │   ├── cli/                # Command-line interface & REPL
│   │   └── websocket/          # Real-time WebSocket support
│   │
│   ├── api/                     # REST API routes
│   │   ├── agent/              # Agent execute/stream/status/cancel/history
│   │   ├── skills/             # Skills listing
│   │   ├── tools/              # Tools listing
│   │   ├── health/             # Health check endpoints
│   │   ├── auth/               # Authentication
│   │   └── webhooks/           # Webhook support
│   │
│   ├── shared/                  # Shared utilities & types
│   ├── middleware/              # Auth, rate-limit, logging, caching
│   └── workers/                 # Background job queue & scheduler
│
├── infrastructure/              # Terraform & Kubernetes configs
├── docker/                     # Docker configurations
├── public/skills/              # Public skill definitions
├── docs/                       # API specs & guides
└── tests/                      # Test files
```

## 🗂️ Core Modules Details

### Reasoning Engine (`src/core/reasoning/`)

| File | Description |
|------|-------------|
| `chain-of-thought.ts` | Step-by-step reasoning implementation |
| `tree-of-thought.ts` | Tree-based exploration reasoning |
| `state-machine.ts` | State-based reasoning with transitions |
| `streaming.ts` | Streaming support for responses |
| `prompt-templates.ts` | Reusable prompt templates |

### Tool System (`src/core/tools/`)

| File | Description |
|------|-------------|
| `registry.ts` | Central tool registration and lookup |
| `executor.ts` | Tool execution engine |
| `validator.ts` | Input/output validation |
| `permissions.ts` | Permission system |
| `built-in/calculator.ts` | Math expression evaluator |
| `built-in/datetime.ts` | Date/time operations |

### Skill System (`src/core/skills/`)

| File | Description |
|------|-------------|
| `loader.ts` | Load skills from files/directories |
| `registry.ts` | Skill registration and storage |
| `matcher.ts` | Match user input to skills |
| `parser.ts` | Parse skill definitions |
| `compiler.ts` | Compile skills to executable format |

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/agent/execute` | POST | Execute agent with input |
| `/api/agent/stream` | POST | Stream agent execution |
| `/api/agent/status/:id` | GET | Get execution status |
| `/api/agent/cancel/:id` | POST | Cancel running agent |
| `/api/agent/history` | GET | Get execution history |
| `/api/skills` | GET | List available skills |
| `/api/tools` | GET | List available tools |
| `/api/health` | GET | Health check |

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Build
npm run build

# Start server
npm start

# Development mode
npm run dev
```

## 🐳 Docker

```bash
# Build
docker build -f docker/Dockerfile.prod -t engine-server .

# Run
docker run -p 3000:3000 engine-server
```

## 📝 License

MIT
