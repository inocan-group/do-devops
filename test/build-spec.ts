import chai from "chai";
import { existsSync } from "fs";
import { rm } from "async-shelljs";

const expect = chai.expect;

describe("build command => ", () => {
  it("creates default config when none exists", async () => {
    const filename = `${process.env.PWD}/do.config.ts`;
    try {
      rm(filename);
    } catch {}
    expect(existsSync(filename)).to.equal(false);
  });
});
