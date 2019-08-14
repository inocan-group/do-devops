import chai from "chai";
import {
  findFunctionConfigurations,
  getFunctionNames,
  detectDuplicateFunctionDefinitions,
  getNamespacedLookup,
  writeServerlessFunctionExports,
  reduceToRelativePath,
  validateExports,
  createFunctionDictionary
} from "../src/shared/functions";
import path from "path";

const expect = chai.expect;
const TEST_PATH = path.join(process.env.PWD, "/test/test-src");

describe("functions => ", () => {
  it("detects all files", async () => {
    const fns = findFunctionConfigurations(
      path.join(process.env.PWD, "/test/test-src")
    );
    expect(fns).to.have.lengthOf(3);
  });

  it("parse of serverless function names works", async () => {
    const fns = findFunctionConfigurations(
      path.join(process.env.PWD, "/test/test-src")
    );
    const lookup = getFunctionNames(fns);
    const expected = ["myBar", "rootPath"];
    expect(Object.keys(lookup)).to.have.lengthOf(3);
    fns.map(fn => {
      expect(lookup[fn]).to.be.a("string");
      expect(expected).to.include(lookup[fn]);
    });
  });

  it("parse of shortened serverless function names works", async () => {
    const fns = findFunctionConfigurations(TEST_PATH).map(f =>
      reduceToRelativePath(TEST_PATH, f)
    );
    const lookup = getFunctionNames(fns);
    const expected = ["myBar", "rootPath"];
    expect(Object.keys(lookup)).to.have.lengthOf(3);
    fns.map(fn => {
      expect(lookup[fn]).to.be.a("string");
      expect(expected).to.include(lookup[fn]);
    });
  });

  it.skip("duplicate function definitions are caught", async () => {
    const fns = findFunctionConfigurations(TEST_PATH);
    const lookup = getFunctionNames(fns);
    const dups = detectDuplicateFunctionDefinitions(lookup);
    expect(dups).to.have.lengthOf(1);
    expect(dups[0].fn);
  });

  it("directories serve as pascalized namespace", async () => {
    const fns = findFunctionConfigurations(TEST_PATH);
    const lookup = getNamespacedLookup(fns, TEST_PATH);
    const expected = ["fooMyBar", "fooBarMyBar", "fooBarMyBar2", "rootPath"];
    expect(fns).to.be.lengthOf(4);
    fns.forEach(fn => {
      expect(lookup[fn]).to.be.a("string");
      expect(expected).to.include(lookup[fn]);
    });
  });

  it("all function definitions export default export", async () => {
    const { valid, invalid } = await validateExports(
      findFunctionConfigurations(TEST_PATH)
    );
    expect(valid).has.lengthOf(2);
    expect(invalid).has.lengthOf(2);
  });

  it("can create a valid function dictionary", async () => {
    const dict = await createFunctionDictionary(TEST_PATH);
    expect(dict).to.be.an("array");
    dict.forEach(f => {
      expect(f).to.be.an("object");
      expect(f).to.haveOwnProperty("filePath");
      expect(f).to.haveOwnProperty("relativePath");
      expect(f).to.haveOwnProperty("serverlessFn");
    });
  });

  it.only("rejects files without default export", async () => {
    // const fns = findFunctionConfigurations(path.join(process.env.PWD, "/test/test-src"));
    writeServerlessFunctionExports(
      TEST_PATH,
      path.join(TEST_PATH, "functions.ts")
    );
  });
});
