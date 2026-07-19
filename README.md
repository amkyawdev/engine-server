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

## 🔧 How to Setup

### Prerequisites

- **Node.js** >= 20.0.0
- **npm** or **yarn**
- **Docker** (optional, for containerized deployment)

### Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/amkyawdev/engine-server.git
cd engine-server

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your settings

# 4. Build the project
npm run build

# 5. Start the server
npm start
```

### Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Logging
LOG_LEVEL=info

# Agent Settings
MAX_STEPS=100
TIMEOUT_MS=60000
DEFAULT_REASONING=chain-of-thought

# Security
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=60000

# Memory
SESSION_TTL_SECONDS=3600
CACHE_MAX_SIZE=1000

# WebSocket
WS_HEARTBEAT_INTERVAL=30000
```

### Development Setup

```bash
# Run in development mode with hot reload
npm run dev

# Run type checking
npm run type-check

# Run linter
npm run lint

# Run linter with auto-fix
npm run lint:fix

# Format code
npm run format
```

### Docker Setup

```bash
# Build the Docker image
docker build -f docker/Dockerfile.prod -t engine-server .

# Run with environment file
docker run -p 3000:3000 --env-file .env engine-server

# Run with Docker Compose
docker-compose up -d

# Development mode with volume mount
docker build -f docker/Dockerfile.dev -t engine-server:dev .
docker run -p 3000:3000 -v $(pwd):/app engine-server:dev
```

### Kubernetes Deployment

```bash
# Apply Kubernetes manifests
kubectl apply -f infrastructure/kubernetes/

# Check deployment status
kubectl get pods -l app=engine-server

# View logs
kubectl logs -l app=engine-server
```

## 📡 API Usage Guide

### Base URL

```
http://localhost:3000/api
```

### Authentication

Include API key in headers (if configured):

```bash
-H "X-API-Key: your-api-key"
```

---

### 1. Execute Agent

Execute an agent with input and receive a response.

**Endpoint:** `POST /api/agent/execute`

```bash
curl -X POST http://localhost:3000/api/agent/execute \
  -H "Content-Type: application/json" \
  -d '{
    "input": "Calculate 15% tip for $45.50 bill",
    "sessionId": "user-session-123",
    "reasoning": "chain-of-thought"
  }'
```

**Response:**

```json
{
  "executionId": "exec-uuid-123",
  "status": "completed",
  "result": {
    "output": "The 15% tip is $6.83",
    "reasoning": "15% of $45.50 = 0.15 × 45.50 = $6.825, rounded to $6.83"
  },
  "steps": 3,
  "executionTime": 1250
}
```

---

### 2. Stream Agent Execution

Stream agent execution in real-time using Server-Sent Events.

**Endpoint:** `POST /api/agent/stream`

```bash
curl -X POST http://localhost:3000/api/agent/stream \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -d '{
    "input": "What is the current time in Tokyo?",
    "sessionId": "user-session-456"
  }'
```

**JavaScript Client Example:**

```javascript
const response = await fetch('http://localhost:3000/api/agent/stream', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    input: 'What is the current time in Tokyo?',
    sessionId: 'session-123'
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const chunk = decoder.decode(value);
  console.log(chunk); // Process SSE events
}
```

---

### 3. Check Execution Status

Get the status of a running or completed execution.

**Endpoint:** `GET /api/agent/status/:executionId`

```bash
curl http://localhost:3000/api/agent/status/exec-uuid-123
```

**Response:**

```json
{
  "executionId": "exec-uuid-123",
  "status": "completed",
  "progress": {
    "currentStep": 3,
    "totalSteps": 3
  },
  "result": {
    "output": "Calculation complete"
  }
}
```

---

### 4. Cancel Execution

Cancel a running agent execution.

**Endpoint:** `POST /api/agent/cancel/:executionId`

```bash
curl -X POST http://localhost:3000/api/agent/cancel/exec-uuid-123
```

**Response:**

```json
{
  "executionId": "exec-uuid-123",
  "status": "cancelled",
  "message": "Execution cancelled successfully"
}
```

---

### 5. Get Execution History

Retrieve execution history for a session.

**Endpoint:** `GET /api/agent/history`

```bash
curl "http://localhost:3000/api/agent/history?sessionId=user-session-123&limit=10&offset=0"
```

**Response:**

```json
{
  "history": [
    {
      "executionId": "exec-001",
      "input": "Calculate 15% tip",
      "output": "$6.83",
      "timestamp": "2024-01-15T10:30:00Z",
      "status": "completed"
    }
  ],
  "total": 25,
  "limit": 10,
  "offset": 0
}
```

---

### 6. List Tools

Get all available tools.

**Endpoint:** `GET /api/tools`

```bash
curl http://localhost:3000/api/tools
```

**Response:**

```json
{
  "tools": [
    {
      "id": "calculator",
      "name": "Calculator",
      "description": "Evaluate mathematical expressions",
      "version": "1.0.0",
      "category": "calculator",
      "parameters": [
        {
          "name": "expression",
          "type": "string",
          "required": true
        }
      ]
    },
    {
      "id": "datetime",
      "name": "DateTime",
      "description": "Date and time operations",
      "version": "1.0.0",
      "category": "datetime"
    }
  ],
  "total": 2
}
```

---

### 7. List Skills

Get all available skills.

**Endpoint:** `GET /api/skills`

```bash
curl http://localhost:3000/api/skills
```

**Response:**

```json
{
  "skills": [
    {
      "id": "code-review",
      "name": "Code Review",
      "description": "Perform code review analysis",
      "version": "1.0.0",
      "triggers": [
        { "type": "keyword", "pattern": "review" }
      ]
    }
  ],
  "total": 1
}
```

---

### 8. Health Check

Check server health status.

**Endpoint:** `GET /api/health`

```bash
curl http://localhost:3000/api/health
```

**Response:**

```json
{
  "status": "healthy",
  "uptime": 3600,
  "version": "1.0.0",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Liveness & Readiness Probes

```bash
# Liveness probe
curl http://localhost:3000/api/health/live

# Readiness probe
curl http://localhost:3000/api/health/ready
```

---

### WebSocket API

Connect via WebSocket for real-time events.

**Endpoint:** `ws://localhost:3000/ws`

```javascript
const ws = new WebSocket('ws://localhost:3000/ws');

ws.on('open', () => {
  ws.send(JSON.stringify({
    type: 'subscribe',
    event: 'agent.progress',
    sessionId: 'user-session-123'
  }));
});

ws.on('message', (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
});
```

---

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

## 🔌 Plugin System

Create custom plugins:

```typescript
import { createPlugin } from './core/plugins';

export default createPlugin({
  name: 'my-plugin',
  version: '1.0.0',
  hooks: {
    beforeExecute: async (context) => {
      console.log('Before execution:', context);
    },
    afterExecute: async (result) => {
      console.log('After execution:', result);
    }
  }
});
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

---

Built with ❤️ for AI Agent Engine

## ☁️ Vercel Deployment

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/amkyawdev/engine-server)

### Manual Deploy

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Vercel Configuration

The `vercel.json` file is pre-configured:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "builds": [
    {
      "src": "dist/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/dist/index.js" },
    { "src": "/(.*)", "dest": "/dist/index.js" }
  ]
}
```

### Environment Variables

Set in Vercel Dashboard → Settings → Environment Variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `JWT_SECRET` | Secret for JWT tokens | Yes |
| `NODE_ENV` | Set to `production` | Yes |
| `PORT` | Server port (default: 3000) | No |
| `REDIS_URL` | Redis connection URL | No |
| `VECTOR_DB_URL` | Vector database URL | No |

### Vercel-Specific Features

```typescript
// Detect Vercel environment
const isVercel = process.env.VERCEL === '1';
const region = process.env.NOW_REGION;

// Serverless function handler
export default async function handler(req, res) {
  // Your API logic here
}
```

### Performance Tips

- Use Edge Functions for low-latency responses
- Configure `regions` in vercel.json for closer deployment
- Enable static caching for public assets

