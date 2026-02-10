# outfitter

Umbrella CLI for scaffolding Outfitter projects and managing workspace adoption.

## Installation

```bash
bun add -g outfitter
```

Or run directly with `bunx`:

```bash
bunx outfitter --help
```

## Quick Start

```bash
# Scaffold a new CLI project with defaults
bunx outfitter create my-cli --preset cli --structure single --yes
cd my-cli
bun install
bun run dev
```

## CLI Overview

```text
outfitter [--json] <command>
```

Global options:

- `--json` - Force JSON output for supported commands

Top-level commands:

- `create [directory]` - Interactive/new scaffolding flow (single package or workspace)
- `init [directory]` - Template scaffolding with explicit flags
- `add <block>` - Add a tooling block (`claude`, `biome`, `lefthook`, `bootstrap`, `scaffolding`)
- `migrate kit [directory]` - Migrate foundation imports and dependencies to `@outfitter/kit`
- `update` - Check installed `@outfitter/*` versions and optionally show migration guidance
- `doctor` - Validate local environment and project dependencies
- `demo [section]` - Showcase `@outfitter/cli` rendering

## Command Reference

### `create`

Interactive/default scaffolding flow.

```bash
outfitter create [directory] [options]
```

Options:

- `-n, --name <name>` - Package name
- `-p, --preset <preset>` - `basic | cli | daemon | mcp`
- `-s, --structure <structure>` - `single | workspace`
- `--workspace-name <name>` - Workspace root package name
- `--local` - Use `workspace:*` for `@outfitter/*` dependencies
- `--workspace` - Alias for `--local`
- `-f, --force` - Overwrite existing files
- `--with <blocks>` - Add specific tooling blocks
- `--no-tooling` - Skip default tooling blocks
- `-y, --yes` - Skip prompts and use defaults

Examples:

```bash
outfitter create my-cli --preset cli --structure single --yes
outfitter create . --preset mcp --yes --no-tooling
outfitter create my-workspace --structure workspace --workspace-name @acme/root
```

### `init`

Template-first scaffolding flow.

```bash
outfitter init [directory] [options]
outfitter init cli [directory] [options]
outfitter init mcp [directory] [options]
outfitter init daemon [directory] [options]
```

Options:

- `-n, --name <name>` - Package name
- `-b, --bin <name>` - Binary name
- `-t, --template <template>` - Template (`basic`, `cli`, `mcp`, `daemon`)
- `--local` - Use `workspace:*` for `@outfitter/*` dependencies
- `--workspace` - Alias for `--local`
- `--with <blocks>` - Add specific tooling blocks
- `--no-tooling` - Skip tooling setup
- `-f, --force` - Overwrite existing files

Examples:

```bash
outfitter init cli my-project
outfitter init . --template basic --name my-lib
outfitter init mcp . --name my-mcp --no-tooling
```

### `add`

Add a tooling block from the registry.

```bash
outfitter add <block> [options]
outfitter add list
```

Options:

- `-f, --force` - Overwrite existing files
- `--dry-run` - Preview without writing files

Examples:

```bash
outfitter add scaffolding
outfitter add biome --dry-run
outfitter add list
```

### `migrate kit`

Codemod for kit-first foundation adoption.

```bash
outfitter migrate kit [directory] [options]
```

Options:

- `--dry-run` - Preview changes without writing files

Examples:

```bash
outfitter migrate kit --dry-run
outfitter migrate kit .
```

### `update`

Check installed `@outfitter/*` packages against npm versions.

```bash
outfitter update [options]
```

Options:

- `--guide` - Include composed migration guidance
- `--cwd <path>` - Working directory to inspect

Examples:

```bash
outfitter update
outfitter update --guide
outfitter update --json --cwd .
```

### `doctor`

Validate local environment and project structure.

```bash
outfitter doctor
```

### `demo`

Showcase CLI rendering primitives.

```bash
outfitter demo [section] [options]
```

Options:

- `-l, --list` - List available sections
- `-a, --animate` - Run animated spinner demo

## Programmatic API

Root exports:

```typescript
import {
  runCreate,
  runDoctor,
  runInit,
  runMigrateKit,
  type CreateOptions,
  type InitOptions,
  type MigrateKitOptions,
} from "outfitter";
```

Command subpath exports:

```typescript
import { runAdd } from "outfitter/commands/add";
import { runUpdate } from "outfitter/commands/update";
```

Example:

```typescript
import { runCreate } from "outfitter";

const result = await runCreate({
  targetDir: "./my-app",
  preset: "cli",
  structure: "single",
  force: false,
  yes: true,
});

if (result.isErr()) {
  console.error(result.error.message);
}
```

## Requirements

- Bun >= 1.3.7

## Related Packages

- `@outfitter/cli` - CLI framework primitives
- `@outfitter/contracts` - Result and error contracts
- `@outfitter/mcp` - MCP server framework
- `@outfitter/tooling` - Tooling presets and verification CLI

## License

MIT
