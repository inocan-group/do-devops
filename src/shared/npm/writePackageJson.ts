import { IPackageJson } from "common-types";
import { writeFile } from "fs";
import path from "path";
import { promisify } from "util";
const write = promisify(writeFile);

export async function writePackageJson(pkg: IPackageJson) {
  await write(path.join(process.cwd(), "package.json"), JSON.stringify(pkg), {
    encoding: "utf-8",
  });
}
