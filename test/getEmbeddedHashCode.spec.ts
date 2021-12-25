import { readFileSync } from "fs";
import { join } from "path";
import { getEmbeddedHashCode } from "~/commands/autoindex/private/util/getEmbeddedHashCode";

describe("autoindex::getAutoindexMetadata()", () => {
  it("can get hashcode from existing file", () => {
    const hashcode = getEmbeddedHashCode(
      readFileSync(join(process.cwd(), "./test/data/autoindex-example.txt"), "utf-8")
    );
    expect(hashcode).toBe("2900540694");
  });
});
