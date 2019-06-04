import globby from "globby";
/**
 * Finds all `index.ts` and `index.js` files and looks for the `#autoindex`
 * signature. If found then it _auto_-builds this file based on files in
 * the file's current directory
 */
export async function handler() {
  const paths = await globby(["**/index.ts", "**/index.js", "!node_modules"]);
  console.log(paths);
}
