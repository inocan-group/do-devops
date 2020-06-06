import { IExportableFiles, removeExtension } from "./index";

/**
 * Given a set of files and directories that are exportable, this function will
 * boil this down to just the string needed for the autoindex block.
 */
export function defaultExports(exportable: IExportableFiles) {
  const contentLines: string[] = [];
  exportable.files.forEach((file) => {
    contentLines.push(`export { default as ${removeExtension(file, true)} } from "./${removeExtension(file)}";`);
  });
  exportable.dirs.forEach((dir) => {
    contentLines.push(`export * from "${dir}/index";`);
  });

  return contentLines.join("\n");
}
