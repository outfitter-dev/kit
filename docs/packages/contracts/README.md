# @outfitter/contracts

Result/Error patterns, error taxonomy, handler contracts, and shared interfaces for the Outfitter ecosystem.

## Status

**Active** - Stable core contracts with active feature development.

## Installation

```bash
bun add @outfitter/contracts
```

## Overview

This package provides the foundational contracts that all Outfitter packages depend on:

- **Error taxonomy** - 10 concrete error classes with category-based exit/status codes
- **Handler contract** - Transport-agnostic domain logic interface
- **Validation** - Zod-based input validation returning Results
- **Serialization** - Safe JSON handling with redaction
- **Adapters** - Pluggable interfaces for indexing, caching, auth, and storage

## Usage

```typescript
import {
  Result,
  NotFoundError,
  Handler,
  HandlerContext,
  createContext,
} from "@outfitter/contracts";

// Define a handler
const getNote: Handler<{ id: string }, Note, NotFoundError> = async (input, ctx) => {
  const note = await db.notes.find(input.id);
  if (!note) return Result.err(NotFoundError.create("note", input.id));
  return Result.ok(note);
};

// Create context and invoke
const ctx = createContext({ logger, config });
const result = await getNote({ id: "abc123" }, ctx);
```

## Error Factory Reference

All error classes provide a static `create()` factory method that generates a consistent message from structured parameters. Use `create()` for structured errors and the constructor for custom messages.

| Error Class | `create()` Signature | Generated Message |
|---|---|---|
| `ValidationError` | `create(field, reason, context?)` | `"email: format invalid"` |
| `ValidationError` | `fromMessage(message, context?)` | *(your message as-is)* |
| `AmbiguousError` | `create(what, candidates, context?)` | `"Ambiguous heading: 2 matches found"` |
| `NotFoundError` | `create(resourceType, resourceId, context?)` | `"note not found: abc123"` |
| `AlreadyExistsError` | `create(resourceType, resourceId, context?)` | `"file already exists: notes/meeting.md"` |
| `ConflictError` | `create(message, context?)` | *(your message as-is)* |
| `PermissionError` | `create(message, context?)` | *(your message as-is)* |
| `TimeoutError` | `create(operation, timeoutMs)` | `"database query timed out after 5000ms"` |
| `RateLimitError` | `create(message, retryAfterSeconds?)` | *(your message as-is)* |
| `NetworkError` | `create(message, context?)` | *(your message as-is)* |
| `InternalError` | `create(message, context?)` | *(your message as-is)* |
| `AuthError` | `create(message, reason?)` | *(your message as-is)* |
| `CancelledError` | `create(message)` | *(your message as-is)* |

### Message Casing

`create()` factories that auto-generate messages use **lowercase** `resourceType`:

```typescript
NotFoundError.create("piece", "abc123");
// → "piece not found: abc123" (not "Piece not found: abc123")
```

If you need a capitalized message, use the constructor directly:

```typescript
new NotFoundError({
  message: "Piece not found: abc123",
  resourceType: "piece",
  resourceId: "abc123",
});
```

## License

MIT
