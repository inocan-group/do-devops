import { copyFileSync } from "fs";
import { removeFile } from "~/shared/file";
import { useExifTools } from "~/shared/images/useExifTools";

enum images {
  fireHydrant = "./test/data/fire-hydrant.jpg",
  flake = "./test/data/Flake.jpg",
  heic = "./test/data/IMG_0086.HEIC",
}

let api: ReturnType<typeof useExifTools>;

describe("testing abstraction of ExifTool API in useExifTools", () => {
  beforeAll(() => {
    api = useExifTools();
  });
  afterAll(async () => {
    await api.close();
  });

  it("version", async () => {
    const v = await api.version();

    expect(typeof v).toBe("string");
    expect(v.includes(".")).toBeTruthy();
  });

  it("get metadata from file", async () => {
    const md = await api.getMetadata(images.flake);

    expect(md.CreatorContactInfo.CiAdrRegion).toBe("CA");
    expect(md.CreatorContactInfo.CiAdrCtry).toBe("US");

    expect(md.errors).toEqual([]);
  });

  it("reduce tag reporting to a categorized subset", async () => {
    // const jpg = metaReducer(await getMetadata(images.fireHydrant));
    const img = await api.categorizedMetadata(images.flake);
    // const heic = metaReducer(await getMetadata(images.heic));

    // expect(jpg.errors).toBeUndefined();
    expect(img.errors).toEqual([]);
    // expect(heic.errors).toBeUndefined();

    expect(img.title).toBe("Flake");
    expect(img.make).toBe("FUJIFILM");
  });

  it("set copyright", async () => {
    const copyright = "© copyrighted to Ken Snyder, all rights reserved";
    const result = await api.addCopyright(images.flake, copyright, true);

    expect(result.Copyright).toBe(copyright);
    expect(result.CopyrightNotice).toBe(copyright);

    const without = await api.removeTags(images.flake, ["Copyright", "CopyrightNotice"], true);

    expect(without.Copyright).toBe(undefined);
    expect(without.CopyrightNotice).toBe(undefined);
  });

  it("clear all meta from an image and then add back title", async () => {
    const copy = images.flake.replace(".jpg", "-copy.jpg");
    copyFileSync(images.flake, copy);

    await api.removeAllMeta(copy, true);

    console.log("meta removed");
    const andNow = await api.getMetadata(copy, true);

    expect(andNow.Title).toBe(undefined);

    const added = await api.setTitle(copy, "Flakey", true);
    expect(added["Title"]).toBe("Flakey");
    expect(added["XPTitle"]).toBe("Flakey");

    removeFile(copy);
  });
});
