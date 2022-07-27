/* eslint-disable unicorn/numeric-separators-style */
import { describe, it, expect } from "vitest";
import { IExifToolMetadata, IImageRule, ISharpMetadata } from "src/@types";
import { checkCacheFreshness } from "src/shared/images/useImageApi/checkCacheFreshness";

describe("useImageApi()", () => {
  it("cache freshness with empty cache", async () => {
    const { missing, outOfDate } = await checkCacheFreshness({ source: {}, converted: {} }, {
      name: "test",
      source: "test/data",
      glob: "**/*.(jpg|heic)",
    } as IImageRule);

    expect(missing).toHaveLength(3);
    expect(outOfDate).toHaveLength(0);
  });

  it("cache freshness with an old cache entry", async () => {
    const fakeEpoch = 1230986616230;
    const { missing, outOfDate } = await checkCacheFreshness(
      {
        source: {
          "Flake.jpg": {
            modified: fakeEpoch,
            created: fakeEpoch,
            file: "Flake.jpg",
            rule: "fakerule",
            width: 123,
            height: 456,
            metaDetailLevel: "basic",
            isSourceImage: true,
            size: 1000,
            sharpMeta: {} as ISharpMetadata,
            meta: {} as IExifToolMetadata,
          },
        },
        converted: {},
      },
      { name: "test", source: "test/data", glob: "**/*.(jpg|heic)" } as IImageRule
    );

    expect(missing).toHaveLength(2);
    expect(outOfDate).toHaveLength(1);
  });
});
