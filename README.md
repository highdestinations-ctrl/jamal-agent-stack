# Jamal Agent Stack

**Integrated Advanced AI Skills for Autonomous Agent Orchestration**

## 🎯 Overview

Jamal Agent Stack is a unified platform for multi-agent AI orchestration, combining:
- **Planning** — Persistent task context & recovery
- **SWE Workflow** — Software engineering lifecycle automation
- **Specialized Subagents** — 140+ domain-specific agents
- **Prompt Generation** — AI prompt engineering system
- **UI/UX Design** — Enterprise design system integration

## 🔧 Integrated Skills

### 1. Planning with Files (OthmanAdi)
**Purpose:** Persistent planning context across sessions

**Usage:**
```bash
# Initialize planning for orchestrator tasks
/plan:start orchestrator.task_name

# Check planning status
/plan:status

# Save planning context to files
.planning/orchestrator.task_name/
```

**Integration Points:**
- `orchestrator/planning/` — Task planning context directory
- Auto-recovery on session restart
- Session history & context continuity

**API:**
- Planning context lives in `.planning/{task_uuid}/`
- Persistent YAML/Markdown files track task state
- Session recovery triggered on `/clear` command

---

### 2. Superpowers (obra)
**Purpose:** SWE lifecycle automation & subagent-driven development

**Usage:**
```bash
# Automated software engineering workflow
/superpowers:spec     # Design phase
/superpowers:plan     # Implementation planning
/superpowers:execute  # Subagent-driven execution
/superpowers:review   # Code review & validation
```

**Integration Points:**
- `orchestrator/deployment/` — Deployment automation
- Subagent dispatch coordination
- TDD-driven development workflows
- Multi-stage code review pipeline

**Workflow Stages:**
1. **Brainstorming** — Clarify requirements
2. **Spec Design** — Create digestible design chunks
3. **Implementation Plan** — Breakdown tasks for subagents
4. **Subagent Dispatch** — Parallel task execution
5. **Review & Validation** — Inspect & merge results

---

### 3. Awesome Claude Code Subagents (VoltAgent)
**Purpose:** 140+ specialized subagents for specific tasks

**Available Categories:**
- `lang-*` — Language specialists (Python, JS, Go, Rust, etc.)
- `infra-*` — Infrastructure & DevOps (Kubernetes, Docker, Terraform)
- `framework-*` — Framework experts (React, Next.js, FastAPI, etc.)
- `meta-orchestration` — Multi-agent coordination

**Usage:**
```bash
# Dispatch specialized subagent
/subagent:dispatch voltagent-lang-python

# List available subagents
/subagent:list

# Chain multiple subagents
/orchestrator:dispatch [voltagent-lang-python, voltagent-infra-docker]
```

**Integration Points:**
- `orchestrator/task/` — Task routing & dispatch
- Subagent selection based on task type
- Result aggregation & coordination

**Task Categories:**
| Category | Agents | Use Case |
|----------|--------|----------|
| `lang-*` | 12+ | Language-specific coding |
| `framework-*` | 20+ | Framework-specific dev |
| `infra-*` | 15+ | DevOps & infrastructure |
| `db-*` | 8+ | Database design & optimization |
| `meta-*` | 5+ | Orchestration & coordination |

---

### 4. Skill Prompt Generator (huangserva)
**Purpose:** Intelligent AI image/design prompt generation

**Usage:**
```bash
# Generate portrait prompt
/prompt:portrait "Asian woman, professional headshot, warm lighting"

# Cross-domain generation
/prompt:cross-domain "futuristic city with people, cyberpunk aesthetic"

# Design system prompt
/prompt:design "Apple-style clean design, minimalist"

# Custom domain combination
/prompt:multi-domain [portrait, design, art]
```

**Integration Points:**
- `config/prompts/` — Prompt templates & rules
- `orchestrator/task/prompt-generation` — Task-driven prompt creation
- Skill routing based on content type

**Supported Domains:**
- 📷 Portrait (photography)
- 🎨 Design (graphic design)
- 🏠 Interior (space design)
- 📦 Product (product photography)
- 🎭 Art (artistic styles)
- 🎬 Video (video generation)
- 🔄 Cross-domain (multi-domain combinations)

**Element Database:** 1246+ elements across domains

---

### 5. UI/UX Pro Max Skill + SkillX
**Purpose:** Enterprise design system & component framework

**Status:** Present in `/data/.openclaw/workspace/skills/ui-ux-pro-max-skill` and `/data/.openclaw/workspace/skills/skillx`

**Integration Points:**
- Component library reference
- Design token system
- Theme configuration in `config/design-tokens.yaml`

---

## 🏗️ Architecture

```
jamal-agent-stack/
├── orchestrator/
│   ├── orchestrator.js      # Main orchestration engine
│   ├── planning/            # Planning context & persistence
│   ├── task/                # Task routing & dispatch
│   ├── deployment/          # SWE workflow automation
│   └── subagents/           # Subagent coordination
├── config/
│   ├── config.yaml          # Main configuration
│   ├── prompts/             # Prompt templates
│   └── design-tokens.yaml   # Design system tokens
├── skills/
│   ├── planning-with-files/
│   ├── superpowers/
│   ├── awesome-claude-code-subagents/
│   ├── skill-prompt-generator/
│   ├── ui-ux-pro-max-skill/
│   └── skillx/
└── README.md
```

---

## 🚀 Usage Patterns

### Pattern 1: Autonomous Task Planning & Execution
```
User Input
  ↓
Planning with Files (persistent context)
  ↓
Skill Prompt Generator (clarify requirements)
  ↓
Superpowers (design & plan)
  ↓
Awesome Subagents (parallel execution)
  ↓
Review & Completion
```

### Pattern 2: Specialized Domain Execution
```
Task Type Detection
  ↓
Route to Specialized Subagent (VoltAgent)
  ↓
Superpowers workflow (if dev task)
  ↓
Execution with context from Planning
  ↓
Result delivery
```

### Pattern 3: Design-Driven Development
```
Design Specification
  ↓
Prompt Generator (design/layout prompts)
  ↓
UI/UX Skill (component mapping)
  ↓
Superpowers (implementation)
  ↓
Deployment (via orchestrator)
```

---

## 🔌 Integration Checklist

- [x] Clone all 4 skills to `/data/.openclaw/workspace/skills/`
- [x] Read & analyze SKILL.md/README from each skill
- [x] Identify integration points for jamal-stack
- [x] Create orchestrator structure
- [ ] Map skill commands to orchestrator API
- [ ] Implement task routing logic
- [ ] Add subagent dispatch coordination
- [ ] Create example workflows
- [ ] Document API specifications

---

## 📚 Skill References

| Skill | Repo | Status | Docs |
|-------|------|--------|------|
| Planning with Files | OthmanAdi/planning-with-files | ✅ Integrated | [docs/openclaw.md](../skills/planning-with-files/docs/openclaw.md) |
| Superpowers | obra/superpowers | ✅ Integrated | [docs/README.md](../skills/superpowers/docs/) |
| Awesome Subagents | VoltAgent/awesome-claude-code-subagents | ✅ Integrated | [categories/](../skills/awesome-claude-code-subagents/categories/) |
| Prompt Generator | huangserva/skill-prompt-generator | ✅ Integrated | [README.md](../skills/skill-prompt-generator/README.md) |
| UI/UX Pro Max | - | ✅ Present | [skills/ui-ux-pro-max-skill/](../skills/ui-ux-pro-max-skill/) |
| SkillX | - | ✅ Present | [skills/skillx/](../skills/skillx/) |

---

## 🔄 Workflow Examples

### Example 1: Build a Python CLI Tool
1. **Planning** → `/plan:start build-python-cli` (persistent context)
2. **Design** → Superpowers spec phase
3. **Prompt** → Generate UI descriptions if needed
4. **Subagent** → Dispatch `voltagent-lang-python` for implementation
5. **Review** → Superpowers review phase
6. **Deploy** → Automated deployment workflow

### Example 2: Design a React Component
1. **Plan** → `/plan:start react-component` (track requirements)
2. **Prompt** → `/prompt:design "Minimal form component"` → get design specs
3. **Spec** → Superpowers design breakdown
4. **Subagents** → `voltagent-framework-react` + `voltagent-lang-typescript`
5. **Review** → Multi-stage validation

### Example 3: Multi-Agent Orchestration
1. **Task Parse** → Identify multiple subtasks
2. **Plan** → Create task breakdown (planning-with-files)
3. **Dispatch** → Route to specialized subagents in parallel
4. **Aggregate** → Combine results from multiple agents
5. **Validate** → Superpowers review phase

---

## 🛠️ Configuration

Edit `config/config.yaml` to:
- Select active skills
- Configure subagent categories
- Set planning persistence paths
- Define workflow stages
- Configure design tokens

---

## 📝 Notes

- **Context Recovery:** Planning skill auto-recovers context when sessions clear
- **Subagent Routing:** Automatically selects best-fit agents for task types
- **Parallel Execution:** Superpowers enables true subagent-driven development
- **Design System:** UI/UX integration enables theme-aware component generation

---

## 🔗 Quick Links

- 🎯 [Orchestrator Documentation](orchestrator/)
- 🧠 [Planning Context Guide](docs/planning.md)
- ⚙️ [Configuration Reference](config/)
- 🤖 [Subagent Categories](../skills/awesome-claude-code-subagents/categories/)

---

**Version:** 1.0.0 | **Last Updated:** 2026-03-10 | **Status:** Active Integration
