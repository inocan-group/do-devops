import "mocha";

import * as helpers from "./helpers";

import { expect } from "chai";

describe("autoindex => ", () => {
  it("indexing work with named exports", async () => {
    // helpers.captureStdout();
  });

  it.skip("indexing work with named-offset exports");
  it.skip("indexing work with default exports");

  it.skip("indexing detects new resource to index");
  it.skip("indexing ignores changes to change to file outside blocked content");

  it.skip("--dir from CLI is working");
  it.skip("--add from CLI is working");
  it.skip("--glob from is working");
});
