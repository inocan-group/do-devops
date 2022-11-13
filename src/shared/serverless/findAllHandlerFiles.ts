import { globbySync as sync } from "globby";
import path from "node:path";

/**
 * Finds all typescript files in the `src/handlers`
 * directory which have a **handler** export.
 */
export async function findAllHandlerFiles() {
  const glob = path.join(process.env.PWD || "", "/src/handlers/**/*.ts");
  const files = sync(glob);
  const handlers: any[] = [];
  console.log(files);

  console.log(handlers.map((i) => i.file));
}
