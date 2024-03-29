import { describe, it, expect } from "vitest";
import xxhash from "xxhash-wasm";
const { h32 } = await xxhash();


describe("Validate that same inputs produce same hash", () => {
  const person1 = { id: 1, name: "Bob", age: 35 };
  const person2 = { id: 2, name: "Jane", age: 22 };
  const person3 = { id: 3, name: "Max", age: 12 };

  it("different data is different with same seed", () => {
    const t1 =  h32(JSON.stringify(person1), 0xCA_FE_BA_BE);
    const t2 = h32(JSON.stringify(person2), 0xCA_FE_BA_BE);
    const t3 = h32(JSON.stringify(person3), 0xCA_FE_BA_BE);

    expect(t1).not.toBe(t2);
    expect(t1).not.toBe(t3);
    expect(t2).not.toBe(t1);
    expect(t2).not.toBe(t3);
  });

  it("same hash is always the same, even with same seed", () => {
    const t1 = h32(JSON.stringify(person1), 0xCA_FE_BA_BE);
    const t2 = h32(JSON.stringify(person1), 0xCA_FE_BA_BE);
    const t3 = h32(JSON.stringify(person1), 0xCA_FE_BA_BE);

    expect(t1).toBe(t2);
    expect(t1).toBe(t3);
  });
});
