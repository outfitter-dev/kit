import { describe, expect, test } from "bun:test";
import { shortAlias } from "../sync-exports";

describe("shortAlias", () => {
	test("biome.json returns biome", () => {
		expect(shortAlias("biome.json")).toBe("biome");
	});

	test("tsconfig.preset.json returns tsconfig", () => {
		expect(shortAlias("tsconfig.preset.json")).toBe("tsconfig");
	});

	test("tsconfig.preset.bun.json returns tsconfig-bun", () => {
		expect(shortAlias("tsconfig.preset.bun.json")).toBe("tsconfig-bun");
	});

	test("lefthook.yml returns lefthook", () => {
		expect(shortAlias("lefthook.yml")).toBe("lefthook");
	});

	test(".markdownlint-cli2.jsonc returns .markdownlint-cli2", () => {
		expect(shortAlias(".markdownlint-cli2.jsonc")).toBe(".markdownlint-cli2");
	});

	test("foo.toml returns foo", () => {
		expect(shortAlias("foo.toml")).toBe("foo");
	});
});
