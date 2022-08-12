import { describe, it, expect } from "vitest";
import { join } from "pathe";
import { fileHasExports } from "src/shared/ast/fileHasExports";

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

  it("a utility file which exports a known function", () => {
    const t = fileHasExports(join(process.cwd(), "src/shared/file/utility/diffFiles.ts"));
    expect(t).toBe(true);
  });

  it("a file which exports a const as a named export", () => {
    const t = fileHasExports(join(process.cwd(), "src/shared/file/saveYamlFile.ts"));
    expect(t).toBe(true);
  });

  it("a file which exports just types", () => {
    const t = fileHasExports(join(process.cwd(), "src/@types/npm-types.ts"));
    expect(t).toBe(true);
  });
});
