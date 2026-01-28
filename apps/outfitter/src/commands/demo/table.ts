/**
 * Table demo section.
 *
 * Showcases renderTable from @outfitter/cli with copy-pasteable examples.
 *
 * @packageDocumentation
 */

import { createTheme, renderTable } from "@outfitter/cli/render";
import type { DemoSection } from "./index.js";
import { registerSection } from "./index.js";

/**
 * Renders the table demo section.
 */
function runTableDemo(): string {
  const theme = createTheme();
  const lines: string[] = [];

  // ==========================================================================
  // Basic Table Section
  // ==========================================================================
  lines.push("BASIC TABLE");
  lines.push("===========");
  lines.push("");
  lines.push('import { renderTable } from "@outfitter/cli/render";');
  lines.push("");
  lines.push("renderTable([");
  lines.push('  { id: 1, name: "Alice", status: "Active" },');
  lines.push('  { id: 2, name: "Bob", status: "Pending" },');
  lines.push("])");
  lines.push("");

  const basicData = [
    { id: 1, name: "Alice", status: "Active" },
    { id: 2, name: "Bob", status: "Pending" },
  ];
  lines.push(renderTable(basicData));

  // ==========================================================================
  // Custom Headers Section
  // ==========================================================================
  lines.push("");
  lines.push("CUSTOM HEADERS");
  lines.push("==============");
  lines.push("");
  lines.push("renderTable(data, {");
  lines.push('  headers: { id: "Task ID", name: "Assignee" }');
  lines.push("})");
  lines.push("");

  lines.push(
    renderTable(basicData, {
      headers: { id: "Task ID", name: "Assignee" },
    })
  );

  // ==========================================================================
  // Column Width Constraint Section
  // ==========================================================================
  lines.push("");
  lines.push("COLUMN WIDTH CONSTRAINT");
  lines.push("=======================");
  lines.push("");
  lines.push("renderTable(data, {");
  lines.push("  columnWidths: { status: 5 }");
  lines.push("})");
  lines.push("");

  lines.push(
    renderTable(basicData, {
      columnWidths: { status: 5 },
    })
  );

  lines.push("");
  lines.push(
    theme.muted('Note: Truncates with "..." when content exceeds column width.')
  );

  // ==========================================================================
  // Wide Characters Section
  // ==========================================================================
  lines.push("");
  lines.push("WIDE CHARACTERS (CJK/Emoji)");
  lines.push("===========================");
  lines.push("");
  lines.push("renderTable([");
  lines.push('  { id: 1, name: "山田太郎", status: "完了" },');
  lines.push('  { id: 2, name: "Party 🎉", status: "🚀" },');
  lines.push("])");
  lines.push("");

  const wideData = [
    { id: 1, name: "山田太郎", status: "完了" },
    { id: 2, name: "Party 🎉", status: "🚀" },
  ];
  lines.push(renderTable(wideData));

  lines.push("");
  lines.push(
    theme.muted("Uses Bun.stringWidth() for correct column alignment.")
  );

  // ==========================================================================
  // Empty Table Section
  // ==========================================================================
  lines.push("");
  lines.push("EMPTY TABLE");
  lines.push("===========");
  lines.push("");
  lines.push('renderTable([]) → "" (empty string, no output)');

  // ==========================================================================
  // Known Limitations Section
  // ==========================================================================
  lines.push("");
  lines.push("KNOWN LIMITATIONS");
  lines.push("=================");
  lines.push("- ASCII borders only (no Unicode box-drawing)");
  lines.push("- No alignment options (left-aligned only)");
  lines.push("- No multi-line cell content");
  lines.push("- No row/column spanning");

  return lines.join("\n");
}

// Register the table section
registerSection({
  id: "table",
  description: "Table rendering demonstration",
  run: runTableDemo,
} satisfies DemoSection);

export { runTableDemo };
