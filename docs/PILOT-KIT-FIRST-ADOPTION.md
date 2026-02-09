# Pilot Report: Kit-First Adoption

Status: Draft (OS-91)  
Date: 2026-02-09  
Parent Workstream: OS-77

This report captures pilot outcomes for kit-first adoption pathways and the
follow-up issues required before final recommendation updates in OS-90.

## Scope

Validated pathways:

- `outfitter create` (CLI-first archetype)
- `outfitter create` (MCP-first archetype)
- `outfitter migrate kit` (mixed-runtime workspace archetype)
- `outfitter init` parity check against `create` tooling controls

## Pilot Matrix

| Archetype | Setup | Pathway | Result |
|---|---|---|---|
| CLI-first | fresh temp repo | `outfitter create --preset cli --structure single --yes --no-tooling` | Pass (resolved in OS-90); command now skips default tooling blocks |
| MCP-first | fresh temp repo | `outfitter create --preset mcp --structure single --yes --no-tooling` | Pass (resolved in OS-90); tooling controls match recommendation docs |
| Mixed runtime workspace | root + `packages/app` with contracts/types imports | `outfitter migrate kit --dry-run --json` then apply | Pass; imports + manifest rewrites were deterministic |
| Init/create parity | fresh temp repo | `outfitter init cli <dir> --no-tooling` | Pass; `init` accepts `--no-tooling` and aligns with `create` |

## Observed Outputs

### `migrate kit` validation

- Dry-run and apply both returned `exitCode 0`.
- Workspace traversal detected and updated target package files only.
- Rewrites were deterministic:
  - `@outfitter/contracts` -> `@outfitter/kit/foundation/contracts`
  - `@outfitter/types` -> `@outfitter/kit/foundation/types`
  - manifest deps removed foundation packages and added `@outfitter/kit`.

### `create` and `init` validation

- `create` succeeds for CLI-first and MCP-first archetypes.
- `create --no-tooling` skips default tooling blocks.
- `init --no-tooling` is supported, and `--with <blocks>` is available for
  explicit tooling selection.

## Historical Pilot Issues (Resolved in OS-90)

- OS-94: `outfitter create --no-tooling` still applies scaffolding blocks  
  <https://linear.app/outfitter/issue/OS-94/pilot-outfitter-create-no-tooling-still-applies-scaffolding-blocks>
- OS-95: Align `outfitter init` and `outfitter create` tooling-control flags  
  <https://linear.app/outfitter/issue/OS-95/pilot-align-outfitter-init-and-outfitter-create-tooling-control-flags>

## Blocking vs Non-Blocking

### Blocking for recommendation finalization (OS-90)

- No remaining blockers after OS-90 follow-up fixes were applied.

### Non-blocking observations

- `migrate kit` command behavior was stable for the mixed workspace scenario.
- Dry-run diff output was sufficient for review and CI-safe preview usage.

## Inputs to OS-90

- Recommendation language should not claim stable tooling-control behavior until
  OS-94 and OS-95 are resolved.
- Final docs should present a single preferred non-interactive setup entrypoint,
  either:
  - unified `create` flow with fixed `--no-tooling`, or
  - explicit `init` deprecation strategy for this scenario.

## Related Docs

- [Mixed Adoption IA (Draft)](./ADOPTION-IA.md)
- [Migration Guide](./MIGRATION.md)
