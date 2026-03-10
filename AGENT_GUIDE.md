
# Jamal Agent Stack — Architecture

This document explains the system architecture and data flow.

---

# High Level Design

The platform follows a **Supervisor / Subagent model**.

control-api (entry layer)
        ↓
orchestrator (supervisor agent)
        ↓
subagents
   ├ assistant-service
   ├ tradingguard-service
   └ policy-service (future)
        ↓
shared contracts
        ↓
persistence
   ├ db
   └ queue

---

# Responsibilities

## control-api
Application entrypoint.

Responsible for:
- receiving requests
- creating tasks
- delegating tasks to orchestrator

## orchestrator
Main supervisor agent.

Responsible for:
- task orchestration
- delegation to subagents
- managing task lifecycle

## subagents

assistant-service:
- handles assistant tasks
- reasoning and tool usage

tradingguard-service:
- enforces trading safety logic

policy-service (future):
- policy enforcement
- rule evaluation

---

# Data Flow

Typical execution flow:

1. Request enters control-api
2. Task is created
3. Task is persisted
4. Task is queued
5. Worker agent consumes task
6. Agent processes task
7. Agent produces report
8. Task status updated

---

# Key Design Principles

1. Supervisor controls delegation
2. Workers stay stateless
3. Persistence boundary is isolated
4. Queue separates execution from scheduling
5. Contracts defined in shared-types

---

# Future Components

Planned extensions:

- Skill system
- LLM router
- Policy engine
- Observability layer
- Distributed workers
