/**
 * @outfitter/tooling
 *
 * Dev tooling configuration presets for Outfitter projects.
 * Provides standardized biome, TypeScript, lefthook, and markdownlint configurations.
 *
 * @example
 * ```json
 * // biome.json
 * {
 *   "extends": ["ultracite/biome/core", "@outfitter/tooling/biome.json"]
 * }
 * ```
 *
 * @example
 * ```json
 * // tsconfig.json
 * {
 *   "extends": "@outfitter/tooling/tsconfig.preset.bun.json"
 * }
 * ```
 *
 * @example
 * ```yaml
 * # .lefthook.yml
 * extends:
 *   - node_modules/@outfitter/tooling/lefthook.yml
 * ```
 *
 * @packageDocumentation
 */

// Re-export registry types for convenience
export type {
	AddBlockOptions,
	AddBlockResult,
	Block,
	BlockDefinition,
	FileEntry,
	Registry,
	RegistryBuildConfig,
} from "./registry/index.js";
export {
	BlockSchema,
	FileEntrySchema,
	RegistrySchema,
} from "./registry/index.js";
/** Package version, read dynamically from package.json. */
export { VERSION } from "./version.js";
