/* eslint-disable unicorn/prefer-module */
import { exec } from "shelljs";
import {
  currentDirectory,
  executionDirectory,
  getSubdirectories,
  homeDirectory,
} from "~/shared/file";

describe("directory utilities => ", () => {
  it("executionDirectory() resolves to current test file", () => {
    const dir = executionDirectory();
    console.log(dir);

    expect(dir).toContain("test");
    expect(dir).not.toContain(".ts");
  });
  it("executionDirectory() with base set results in relative path", () => {
    const dir = executionDirectory({ base: currentDirectory() });
    expect(dir).toBe("test/");
  });

  it("homeDirectory() resolves to user's home directory", () => {
    const dir = homeDirectory();
    const user = exec(`whoami`).stdout.trim();

    expect(dir).toContain(user);
    expect(dir).not.toContain(".ts");
  });

  it("homeDirectory() with offset works as expected", () => {
    const dir = homeDirectory({ offset: ".." });
    const user = exec(`whoami`).stdout.trim();
    const subDirs = getSubdirectories(dir);

    expect(subDirs).toContain(user);
    expect(dir).not.toContain(".ts");

    const dir2 = homeDirectory({ offset: ".aws" });
    expect(dir2).toContain(user);
    expect(dir2).toContain("/.aws");
  });
});
