# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Outfitter Kit is a Bun-first, strictly typed, test-driven monorepo providing shared infrastructure for Outfitter projects. It includes reusable libraries and runtimes (CLI, MCP, server, daemon, indexing primitives) plus an umbrella CLI named `outfitter`.

**Status**: In early development (Phase 0 complete — monorepo foundation established, no packages implemented yet).

## Commands

```bash
# Install dependencies
bun install

# Build all packages (Turborepo orchestrated)
bun run build

# Run tests
bun run test
bun run test:watch        # Watch mode

# Lint and format
bun run lint              # Check linting
bun run lint:fix          # Auto-fix lint issues
bun run format            # Format with Biome
bun run format:check      # Check formatting

# Type checking
bun run typecheck

# Clean build artifacts
bun run clean

# Changesets (versioning)
bun run changeset         # Add a changeset
bun run version-packages  # Update versions
bun run release           # Build and publish
```

### Running a single package

```bash
# Run tests for a specific package
bun run test --filter=@outfitter/cli

# Build a specific package
bun run build --filter=@outfitter/contracts
```

## Architecture

### Package Tiers (dependency flow: Foundation → Runtime → Tooling)

**Foundation Tier (cold)** — Stable APIs, rarely change:
- `@outfitter/contracts` — Result/Error patterns, error taxonomy, TaggedError base classes
- `@outfitter/types` — Branded types, type utilities

**Runtime Tier (warm)** — Expected to evolve:
- `@outfitter/cli` — Typed Commander.js wrapper, output contract, pagination
- `@outfitter/mcp` — MCP server framework with typed tools
- `@outfitter/config` — XDG-compliant config loading with schema validation
- `@outfitter/logging` — Structured logging via logtape with redaction
- `@outfitter/file-ops` — Workspace detection, path security, file locking
- `@outfitter/state` — Pagination state, cursor persistence
- `@outfitter/ui` — Terminal output shapes, colors, renderers
- `@outfitter/index` — SQLite FTS5 indexing with WAL and locking
- `@outfitter/daemon` — Daemon lifecycle, IPC, health checks
- `@outfitter/testing` — Test harnesses for MCP and CLI

**Tooling Tier (lukewarm)** — Workflow-focused:
- `outfitter` — Umbrella CLI for scaffolding projects

### Directory Structure

```
kit/
├── packages/       # Publishable packages
├── apps/           # Runnable CLIs / daemons
├── templates/      # Scaffolding assets
├── scripts/        # Monorepo utilities
├── SPEC.md         # Detailed technical specification
└── PLAN.md         # Phased implementation roadmap
```

### Handler Contract

All domain logic uses transport-agnostic handlers that return `Result<T, E>`:

```typescript
type Handler<TInput, TOutput, TError> = (
  input: TInput,
  ctx: HandlerContext
) => Promise<Result<TOutput, TError>>;
```

CLI and MCP are thin adapters over shared handlers — handlers know nothing about output format or transport.

## Development Principles

### TDD-First (Non-Negotiable)

1. **Red**: Write a failing test that defines expected behavior
2. **Green**: Write minimal code to make the test pass
3. **Refactor**: Improve code while keeping tests green

Never write implementation before the test. The failing test IS the spec.

### Bun-First

Use Bun-native APIs before reaching for npm packages:
- `Bun.hash()`, `Bun.Glob`, `Bun.semver`, `Bun.$` (shell)
- `Bun.color()`, `Bun.stringWidth()`, `Bun.stripANSI()`
- `bun:sqlite` for SQLite with FTS5

### Blessed Dependencies

| Concern | Package |
|---------|---------|
| Result type | `better-result` |
| Schema validation | `zod` (v4) |
| CLI parsing | `commander` |
| Logging | `logtape` |
| MCP protocol | `@modelcontextprotocol/sdk` |
| Prompts | `@clack/prompts` |

## TypeScript Configuration

Strict mode enabled with additional safety checks:
- `noImplicitAny`, `strictNullChecks`, `noUncheckedIndexedAccess`
- `exactOptionalPropertyTypes`, `noPropertyAccessFromIndexSignature`
- `verbatimModuleSyntax` for explicit import types

## Git Hooks (Lefthook)

- **pre-commit**: Format check, lint, typecheck (affected packages)
- **pre-push**: Full test suite

## Key Files

- `SPEC.md` — Complete technical specification with API contracts
- `PLAN.md` — Implementation roadmap with harvest-then-build approach
- `biome.json` — Linting/formatting config (tabs, double quotes, semicolons)
- `tsconfig.base.json` — Shared TypeScript config for all packages
