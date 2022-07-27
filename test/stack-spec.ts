/* eslint-disable unicorn/prefer-module */
import { describe, it, expect } from "vitest";
import { getCaller } from "src/shared/stack";

function iAmALittleTeapot() {
  return getCaller();
}

function caller() {
  return iAmALittleTeapot();
}

class Foobar {
  talk() {
    return iAmALittleTeapot();
  }
}

describe("stack utility functions => ", () => {
  it("getCaller() returns expected properties from a function", () => {
    const r = caller();
    expect(r.fn).toBe("caller");
    expect(typeof r.lineNumber).toBe("number");
    expect(r.filePath).toContain("test");
    expect(r.fileName).toBe("stack-spec.ts");
    expect(r.isClassMethod).toBeFalsy();
  });

  it("getCaller() returns expected properties from a class method", () => {
    const fb = new Foobar();
    const r = fb.talk();

    expect(r.fn).toBe("talk");
    expect(r.filePath).toContain("test");
    expect(r.fileName).toBe("stack-spec.ts");
    expect(r.isClassMethod).toBeTruthy();
  });
});
