import { currentDirectory } from "src/shared/file";
import { getDefaultExport } from "src/shared/ast";
import { describe, it, expect } from "vitest";

describe("ast > Acorn AST parsing", () => {
  it("extract appropriate info from a direct export of the default export", () => {
    const defaultExport = getDefaultExport({
      filename: currentDirectory("test/data/acorn-test-data/defaultExport.ts"),
    });
    expect(defaultExport).toBeTruthy();
    if (defaultExport) {
      expect(defaultExport.defaultExport).toBe("StateMachine");
      expect(defaultExport.symbols).toContain("stepFunction");
    }
  });

  it("extract appropriate info from an indirect export of the default export", () => {
    const defaultExport = getDefaultExport({
      filename: currentDirectory("test/data/acorn-test-data/defaultAbstractedExport.ts"),
    });
    expect(defaultExport).toBeTruthy();
  });
});
