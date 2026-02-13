# @outfitter/docs-core

Core docs assembly and freshness-check primitives for Outfitter-based projects.

## Scope

- Discover publishable workspace packages
- Assemble package docs into a centralized output tree
- Rewrite relative links so relocated docs remain valid
- Check generated docs for drift (missing, changed, unexpected files)
- Render `llms.txt` and `llms-full.txt` from the same docs graph
- Process MDX inputs with `strict` or `lossy` downleveling modes

## API

```ts
import {
  checkLlmsDocs,
  checkPackageDocs,
  syncLlmsDocs,
  syncPackageDocs,
} from "@outfitter/docs-core";

const syncResult = await syncPackageDocs({
  workspaceRoot: process.cwd(),
  mdxMode: "strict",
});

const checkResult = await checkPackageDocs({
  workspaceRoot: process.cwd(),
});

const llmsSyncResult = await syncLlmsDocs({
  workspaceRoot: process.cwd(),
  mdxMode: "lossy",
  targets: ["llms", "llms-full"],
});

const llmsCheckResult = await checkLlmsDocs({
  workspaceRoot: process.cwd(),
  targets: ["llms", "llms-full"],
});
```

## License

MIT
