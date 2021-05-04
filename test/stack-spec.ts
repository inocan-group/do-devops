/* eslint-disable unicorn/prefer-module */
import { getCaller } from "~/shared/stack";

function iAmALittleTeapot() {
  return getCaller();
}

function caller() {
  return iAmALittleTeapot();
}

describe("stack utility functions => ", () => {
  it("getCaller() returns expected properties", () => {
    const r = caller();
    expect(r.fn).toBe("iAmALittleTeapot");
    expect(typeof r.lineNumber).toBe("number");
    expect(r.filePath).toContain("test");
    expect(r.fileName).toBe("stack-spec.ts");
  });
});
