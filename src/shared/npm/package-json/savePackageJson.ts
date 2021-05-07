import { IPackageJson } from "common-types";
import { writeFile } from "fs";
import path from "path";
import { promisify } from "util";
const write = promisify(writeFile);

export async function savePackageJson(pkg: IPackageJson) {
  await write(path.join(process.cwd(), "package.json"), JSON.stringify(pkg, null, 2), {
    encoding: "utf-8",
  });
}
