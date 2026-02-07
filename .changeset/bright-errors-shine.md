---
"@outfitter/contracts": minor
---

Add error ergonomics and Result boundary helper

- Add optional `context` field to `NotFoundError` and `ValidationError` for attaching structured metadata
- Add `static create()` factory methods to all 10 error classes for concise construction
- Add `AmbiguousError` class (category: `validation`, code: `AMBIGUOUS_MATCH`) for disambiguation scenarios with a `candidates` field
- Add `expect()` Result utility that unwraps Ok or throws with a contextual error message
