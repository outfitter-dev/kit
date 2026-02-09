/**
 * Tests for resolveLogLevel() environment integration (OS-71 Phase 3)
 *
 * Verifies the precedence chain:
 * OUTFITTER_LOG_LEVEL > explicit level > environment profile > "info"
 */
import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { resolveLogLevel } from "../index.js";

describe("resolveLogLevel()", () => {
  let originalEnv: string | undefined;
  let originalLogLevel: string | undefined;

  beforeEach(() => {
    originalEnv = process.env["OUTFITTER_ENV"];
    originalLogLevel = process.env["OUTFITTER_LOG_LEVEL"];
  });

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env["OUTFITTER_ENV"];
    } else {
      process.env["OUTFITTER_ENV"] = originalEnv;
    }
    if (originalLogLevel === undefined) {
      delete process.env["OUTFITTER_LOG_LEVEL"];
    } else {
      process.env["OUTFITTER_LOG_LEVEL"] = originalLogLevel;
    }
  });

  it("defaults to info when nothing is configured", () => {
    delete process.env["OUTFITTER_ENV"];
    delete process.env["OUTFITTER_LOG_LEVEL"];

    expect(resolveLogLevel()).toBe("info");
  });

  it("uses explicit level when provided", () => {
    delete process.env["OUTFITTER_ENV"];
    delete process.env["OUTFITTER_LOG_LEVEL"];

    expect(resolveLogLevel("debug")).toBe("debug");
    expect(resolveLogLevel("error")).toBe("error");
  });

  it("uses environment profile when no explicit level", () => {
    process.env["OUTFITTER_ENV"] = "development";
    delete process.env["OUTFITTER_LOG_LEVEL"];

    expect(resolveLogLevel()).toBe("debug");
  });

  it("explicit level overrides environment profile", () => {
    process.env["OUTFITTER_ENV"] = "development";
    delete process.env["OUTFITTER_LOG_LEVEL"];

    expect(resolveLogLevel("error")).toBe("error");
  });

  it("OUTFITTER_LOG_LEVEL overrides explicit level", () => {
    delete process.env["OUTFITTER_ENV"];
    process.env["OUTFITTER_LOG_LEVEL"] = "debug";

    expect(resolveLogLevel("error")).toBe("debug");
  });

  it("OUTFITTER_LOG_LEVEL overrides environment profile", () => {
    process.env["OUTFITTER_ENV"] = "production";
    process.env["OUTFITTER_LOG_LEVEL"] = "debug";

    expect(resolveLogLevel()).toBe("debug");
  });

  it("maps warning to warn (MCP to logging convention)", () => {
    delete process.env["OUTFITTER_ENV"];
    process.env["OUTFITTER_LOG_LEVEL"] = "warning";

    expect(resolveLogLevel()).toBe("warn");
  });

  it("maps emergency to fatal (MCP to logging convention)", () => {
    delete process.env["OUTFITTER_ENV"];
    process.env["OUTFITTER_LOG_LEVEL"] = "emergency";

    expect(resolveLogLevel()).toBe("fatal");
  });

  it("ignores invalid OUTFITTER_LOG_LEVEL values", () => {
    delete process.env["OUTFITTER_ENV"];
    process.env["OUTFITTER_LOG_LEVEL"] = "verbose";

    expect(resolveLogLevel()).toBe("info");
  });

  it("production environment defaults to info", () => {
    process.env["OUTFITTER_ENV"] = "production";
    delete process.env["OUTFITTER_LOG_LEVEL"];

    // Production profile has logLevel: null → falls through to "info"
    expect(resolveLogLevel()).toBe("info");
  });

  it("test environment defaults to info", () => {
    process.env["OUTFITTER_ENV"] = "test";
    delete process.env["OUTFITTER_LOG_LEVEL"];

    // Test profile has logLevel: null → falls through to "info"
    expect(resolveLogLevel()).toBe("info");
  });
});
