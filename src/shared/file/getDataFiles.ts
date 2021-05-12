import fg from "globby";
import path from "path";
import process from "process";

export interface IDataFileOptions {
  /** allows filtering by a particular file type (aka, file extension) */
  fileType?: string;
  /** optionally filter results to those which contain a given string */
  filterBy?: string;
  /** optionally strip off the file extentions from the list */
  stripFileExtension?: boolean;
}

function strip(opts: IDataFileOptions) {
  return (results: string[]) => {
    if (opts.filterBy) {
      results = results.filter((i) => i.includes(opts.filterBy as string));
    }

    if (opts.stripFileExtension) {
      results = results.map((i) => i.replace(/(.*)\.\w*$/, "$1"));
    }
    const prefix = process.cwd() + "/test/data/";

    return results.map((i) => i.replace(prefix, ""));
  };
}

/**
 * Gets a list of data files from the
 * `test/data` directory.
 */
export async function getDataFiles(opts: IDataFileOptions = {}) {
  const glob = path.join(
    process.cwd(),
    "test/data",
    opts.fileType ? `**/*.${opts.fileType}` : "**/*"
  );
  const results = await fg(glob);

  return strip(opts)(results);
}
