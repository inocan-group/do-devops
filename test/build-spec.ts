import { existsSync } from "fs";
import { rm } from "async-shelljs";

describe("build command => ", () => {
  it("creates default config when none exists", async () => {
    const filename = `${process.env.PWD}/do.config.ts`;
    try {
      if(existsSync(filename)) {rm(filename);}
    } catch {}
    expect(existsSync(filename)).toBeFalsy();
  });
});
