import { sync } from "globby";
import path from "path";

/**
 * Finds all typescript files in the `src/handlers`
 * directory which have a **handler** export.
 */
export async function findAllHandlerFiles() {
  const glob = path.join(process.env.PWD || "", "/src/handlers/**/*.ts");
  const files = sync(glob);
  const handlers: any[] = [];
  console.log(files);

  // const project = new Project();
  // project.addSourceFilesAtPaths(files);

  // TODO:

  // for await (const file of files) {
  // const ref = await import(file);
  // if (ref.handler) {
  //   handlers.push({ file, ref });
  // }
  // }
  console.log(handlers.map((i) => i.file));
}
