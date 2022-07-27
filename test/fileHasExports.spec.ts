import { describe, it, expect } from "vitest";
import { join } from "pathe";
import { fileHasExports } from "src/shared/ast";

describe("fileHasExports() utility", () => {
  it("an autoindex file with file exports", () => {
    const t = fileHasExports(join(process.cwd(), "test/data/autoindex-example-file.txt"));
    expect(t).toBe(true);
  });

  it("an autoindex file with dir exports", () => {
    const t = fileHasExports(join(process.cwd(), "test/data/autoindex-example.txt"));
    expect(t).toBe(true);
  });

  it("an autoindex file with only type exports", () => {
    const t = fileHasExports(join(process.cwd(), "test/data/autoindex-example-type-export.txt"));
    expect(t).toBe(true);
  });
});
