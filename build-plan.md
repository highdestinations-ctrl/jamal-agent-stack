
# Jamal Agent Stack — Build Plan

This document defines the build roadmap for the jamal-agent-stack.

The coding agent must follow this document sequentially.
Do not skip milestones.
Do not redesign architecture.
Complete milestones in order.

---

# Architecture

The system follows a Supervisor / Subagent architecture.

control-api
    ↓
orchestrator (supervisor)
    ↓
assistant-service
tradingguard-service
policy-service
    ↓
shared-types
    ↓
db (task persistence)
    ↓
queue (task dispatch)

---

# Development Rules

The coding agent must follow these rules:

1. Never redesign the architecture.
2. Never introduce heavy dependencies early.
3. Build minimal compileable steps.
4. Keep everything TypeScript-first.
5. Prefer extending existing code.
6. Avoid premature optimization.
7. Each milestone must compile.

---

# Milestones

## Milestone 1 — Project Skeleton ✅
Monorepo setup
pnpm workspace
base TypeScript configuration

## Milestone 2 — Infrastructure ✅
Docker
Postgres
Redis

## Milestone 3 — Shared Contracts ✅
shared-types
agent contracts
task contracts
supervision contracts

## Milestone 4 — Core Services ✅
orchestrator
assistant-service
tradingguard-service

## Milestone 5 — Control API ✅
app entrypoint
demo flow

## Milestone 6 — Persistence Boundary ✅
packages/db
TaskRepository
InMemoryTaskRepository

## Milestone 7 — Queue Boundary
Create queue abstraction.

packages/queue

Interfaces:
TaskQueue
QueuedTaskRecord

Implementation:
InMemoryTaskQueue

Then update:
orchestrator
control-api

to enqueue tasks instead of direct delegation.

## Milestone 8 — HTTP Layer ✅
Add minimal HTTP entrypoint.

control-api server

POST /tasks

creates tasks and enqueues them.

## Milestone 9 — Worker Runtime ✅
Create worker loops.

assistant-service worker
tradingguard-service worker

Workers poll queue.

## Milestone 10 — Policy Engine ✅
Introduce policy-service.

Policy checks run before execution.

## Milestone 11 — Skill System
Introduce skill-service.

Skills registry
skill runtime

## Milestone 12 — LLM Router
Implement model routing.

small models for classification
large models for reasoning

---

# Agent Execution Instructions

When executing this plan:

1. Determine the first incomplete milestone.
2. Implement only that milestone.
3. Keep changes minimal.
4. Ensure the repository compiles.
5. Update this document marking the milestone as complete.
