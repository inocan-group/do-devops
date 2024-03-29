import { join } from "node:path";
import { directoryFiles, removeFile } from "src/shared/file";

export function removeTempFiles() {
  const files = directoryFiles("./test/data/temp")
    .map((i) => i.file)
    .filter((i) => !["README.md", ".DS_Store"].includes(i));

  for (const file of files) {
    removeFile(join("./test/data/temp/", file));
  }
}
