import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

/**
 * Agent instruction files are loaded into every session, so their length is a
 * real cost paid on every run. These budgets exist to force a prune before an
 * addition — they are not sacred. Raise one when the new content is worth more
 * than what is already in the file, never just to make a red run go green.
 *
 * The headroom is deliberately thin: enough for a rule or two, not enough to
 * drift. Claude Code warns that adherence drops past 200 lines, so the ceiling
 * that matters is far below any hard limit.
 */
const BUDGETS: Record<string, number> = {
  "AGENTS.md": 65,
  "CLAUDE.md": 12,
};

const repoRoot = resolve(__dirname, "../..");
const lineCount = (file: string) =>
  readFileSync(resolve(repoRoot, file), "utf-8").trimEnd().split("\n").length;

describe("agent instructions", () => {
  for (const [file, budget] of Object.entries(BUDGETS)) {
    it(`${file} stays within ${budget} lines`, () => {
      const lines = lineCount(file);
      expect(
        lines,
        `${file} is ${lines} lines against a budget of ${budget}. Cut something before adding, or raise the budget on purpose.`,
      ).toBeLessThanOrEqual(budget);
    });
  }

  it("CLAUDE.md only bridges to AGENTS.md", () => {
    const firstLine = readFileSync(resolve(repoRoot, "CLAUDE.md"), "utf-8").split("\n")[0].trim();
    expect(
      firstLine,
      "CLAUDE.md must start with the @AGENTS.md import, or Claude Code loses every shared instruction.",
    ).toBe("@AGENTS.md");
  });
});
