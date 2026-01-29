/**
 * Tests for layout render utilities
 *
 * Tests cover:
 * - joinHorizontal (6 tests)
 * - joinVertical (4 tests)
 *
 * Total: 10 tests
 */
import { describe, expect, it } from "bun:test";
import { joinHorizontal, joinVertical } from "../render/layout.js";

// ============================================================================
// joinHorizontal Tests
// ============================================================================

describe("joinHorizontal", () => {
  describe("basic functionality", () => {
    it("joins two single-line blocks side by side", () => {
      const result = joinHorizontal(["Left", "Right"]);
      expect(result).toBe("LeftRight");
    });

    it("joins multiline blocks side by side", () => {
      const left = "A\nB";
      const right = "1\n2";
      const result = joinHorizontal([left, right]);
      expect(result).toBe("A1\nB2");
    });

    it("handles blocks of different heights (top alignment)", () => {
      const short = "A";
      const tall = "1\n2\n3";
      const result = joinHorizontal([short, tall], { align: "top" });
      expect(result).toBe("A1\n 2\n 3");
    });
  });

  describe("gap option", () => {
    it("adds gap between blocks", () => {
      const result = joinHorizontal(["Left", "Right"], { gap: 2 });
      expect(result).toBe("Left  Right");
    });

    it("adds gap between multiline blocks", () => {
      const left = "A\nB";
      const right = "1\n2";
      const result = joinHorizontal([left, right], { gap: 2 });
      expect(result).toBe("A  1\nB  2");
    });
  });

  describe("alignment options", () => {
    it("aligns blocks to center", () => {
      const short = "A";
      const tall = "1\n2\n3";
      const result = joinHorizontal([short, tall], { align: "center" });
      expect(result).toBe(" 1\nA2\n 3");
    });

    it("aligns blocks to bottom", () => {
      const short = "A";
      const tall = "1\n2\n3";
      const result = joinHorizontal([short, tall], { align: "bottom" });
      expect(result).toBe(" 1\n 2\nA3");
    });
  });

  describe("edge cases", () => {
    it("handles empty array", () => {
      const result = joinHorizontal([]);
      expect(result).toBe("");
    });

    it("handles single block", () => {
      const result = joinHorizontal(["Only"]);
      expect(result).toBe("Only");
    });
  });
});

// ============================================================================
// joinVertical Tests
// ============================================================================

describe("joinVertical", () => {
  describe("basic functionality", () => {
    it("stacks blocks vertically", () => {
      const result = joinVertical(["Top", "Bottom"]);
      expect(result).toBe("Top\nBottom");
    });

    it("stacks multiline blocks", () => {
      const first = "A\nB";
      const second = "1\n2";
      const result = joinVertical([first, second]);
      expect(result).toBe("A\nB\n1\n2");
    });
  });

  describe("gap option", () => {
    it("adds gap between blocks", () => {
      const result = joinVertical(["Top", "Bottom"], { gap: 1 });
      expect(result).toBe("Top\n\nBottom");
    });

    it("adds larger gap between blocks", () => {
      const result = joinVertical(["Top", "Bottom"], { gap: 2 });
      expect(result).toBe("Top\n\n\nBottom");
    });
  });

  describe("edge cases", () => {
    it("handles empty array", () => {
      const result = joinVertical([]);
      expect(result).toBe("");
    });

    it("handles single block", () => {
      const result = joinVertical(["Only"]);
      expect(result).toBe("Only");
    });
  });
});
