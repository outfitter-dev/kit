import { describe, expect, it } from "bun:test";
import { z } from "zod";
import { zodToJsonSchema } from "../schema.js";

describe("zodToJsonSchema required detection", () => {
	it("omits required for optional fields wrapped by effects", () => {
		const schema = z.object({
			name: z
				.string()
				.optional()
				.transform((value) => value ?? "anonymous"),
		});

		const jsonSchema = zodToJsonSchema(schema);

		expect(jsonSchema.required).toBeUndefined();
	});

	it("keeps required for pipeline fields unless both sides are optional", () => {
		const schema = z.object({
			id: z.string().optional().pipe(z.string()),
		});

		const jsonSchema = zodToJsonSchema(schema);

		expect(jsonSchema.required).toEqual(["id"]);
	});

	it("marks pipeline optional when both input and output are optional", () => {
		const schema = z.object({
			id: z.string().optional().pipe(z.string().optional()),
		});

		const jsonSchema = zodToJsonSchema(schema);

		expect(jsonSchema.required).toBeUndefined();
	});
});
