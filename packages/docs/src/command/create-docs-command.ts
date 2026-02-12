import { Command } from "commander";
import { executeCheckCommand } from "../commands/check.js";
import { executeExportCommand } from "../commands/export.js";
import { executeSyncCommand } from "../commands/sync.js";

export interface CreateDocsCommandOptions {
  readonly commandName?: string;
  readonly io?: {
    readonly out?: (line: string) => void;
    readonly err?: (line: string) => void;
  };
}

function getIo(options: CreateDocsCommandOptions | undefined): {
  readonly out: (line: string) => void;
  readonly err: (line: string) => void;
} {
  return {
    out:
      options?.io?.out ?? ((line: string) => process.stdout.write(`${line}\n`)),
    err:
      options?.io?.err ?? ((line: string) => process.stderr.write(`${line}\n`)),
  };
}

export function createDocsCommand(options?: CreateDocsCommandOptions): Command {
  const io = getIo(options);

  const command = new Command(options?.commandName ?? "docs");
  command.description("Synchronize and verify package docs outputs");

  command
    .command("sync")
    .description("Assemble package docs into docs/packages")
    .option("--cwd <path>", "Workspace root to operate in")
    .option("--packages-dir <path>", "Packages directory relative to workspace")
    .option("--output-dir <path>", "Output directory relative to workspace")
    .option("--mdx-mode <mode>", "MDX handling mode: strict or lossy")
    .action(
      async (cmdOptions: {
        cwd?: string;
        mdxMode?: "strict" | "lossy";
        packagesDir?: string;
        outputDir?: string;
      }) => {
        const code = await executeSyncCommand(cmdOptions, io);
        if (code !== 0) {
          process.exitCode = code;
        }
      }
    );

  command
    .command("check")
    .description("Check whether assembled package docs are in sync")
    .option("--cwd <path>", "Workspace root to operate in")
    .option("--packages-dir <path>", "Packages directory relative to workspace")
    .option("--output-dir <path>", "Output directory relative to workspace")
    .option("--mdx-mode <mode>", "MDX handling mode: strict or lossy")
    .action(
      async (cmdOptions: {
        cwd?: string;
        mdxMode?: "strict" | "lossy";
        packagesDir?: string;
        outputDir?: string;
      }) => {
        const code = await executeCheckCommand(cmdOptions, io);
        if (code !== 0) {
          process.exitCode = code;
        }
      }
    );

  command
    .command("export")
    .description("Export docs artifacts for packages and LLM targets")
    .option("--cwd <path>", "Workspace root to operate in")
    .option("--packages-dir <path>", "Packages directory relative to workspace")
    .option("--output-dir <path>", "Output directory relative to workspace")
    .option("--mdx-mode <mode>", "MDX handling mode: strict or lossy")
    .option("--llms-file <path>", "llms.txt output path relative to workspace")
    .option(
      "--llms-full-file <path>",
      "llms-full.txt output path relative to workspace"
    )
    .option(
      "--target <target>",
      "Export target: packages, llms, llms-full, all",
      "all"
    )
    .action(
      async (cmdOptions: {
        cwd?: string;
        llmsFile?: string;
        llmsFullFile?: string;
        mdxMode?: "strict" | "lossy";
        outputDir?: string;
        packagesDir?: string;
        target?: string;
      }) => {
        const code = await executeExportCommand(cmdOptions, io);
        if (code !== 0) {
          process.exitCode = code;
        }
      }
    );

  return command;
}
