/* eslint-disable unicorn/prefer-module */
import { executionDirectory } from "../src/shared";

describe("basedir => ", () => {
  it("current directory is the current test directory", () => {
    const dir = executionDirectory();
    expect(dir).toContain("test");
  });
});
