import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "pathe";
import { getEmbeddedHashCode } from "src/commands/autoindex/private/util/getEmbeddedHashCode";

describe("autoindex::getAutoindexMetadata()", () => {
  it("can get hashcode from existing file", () => {
    const hashcode = getEmbeddedHashCode(
      readFileSync(join(process.cwd(), "./test/data/autoindex-example.txt"), "utf8")
    );
    expect(hashcode).toBe("2900540694");
  });
});
