import { test, expect } from "bun:test";

import { InitError, runInit } from "../index";

test("runInit returns a helpful error for missing templates", async () => {
	const result = await runInit({
		targetDir: "./tmp-outfitter-missing-template",
		template: "does-not-exist",
		force: false,
	});

	expect(result.isErr()).toBe(true);

	if (result.isErr()) {
		expect(result.error).toBeInstanceOf(InitError);
		expect(result.error.message).toContain("Template");
	}
});
