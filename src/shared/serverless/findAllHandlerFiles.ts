import path from "path";
import fg from "fast-glob";
import { getExportsFromFile } from "../index";

/**
 * Finds all typescript files in the `src/handlers`
 * directory which have a **handler** export.
 */
export async function findAllHandlerFiles() {
  const glob = path.join(process.env.PWD, "/src/handlers/**/*.ts");
  const files = fg.sync(glob);
  const handlers = [];
  console.log(files);

  for await (const file of files) {
    console.log(file);

    const ref = await import(file);
    if (ref.handler) {
      handlers.push({ file, ref });
    }
  }
  console.log(handlers.map(i => i.file));
}
