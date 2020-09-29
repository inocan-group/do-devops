import chalk from "chalk";
import globby from "globby";
import { IDictionary, wait } from "common-types";
import {
  askHowToHandleMonoRepoIndexing,
  isAutoindexFile,
  processFiles,
  watchHandlers,
} from "../private/index";
import { getMonoRepoPackages, relativePath } from "../../../shared";
import { posix } from "path";
import { FSWatcher, watch } from "chokidar";

/**
 * Finds all `index.ts` and `index.js` files and looks for the `#autoindex`
 * signature. If found then it _auto_-builds this file based on files in
 * the file's current directory
 */
export async function handler(argv: string[], opts: IDictionary): Promise<void> {
  const monoRepoPackages: false | string[] = getMonoRepoPackages(process.cwd());
  const globInclude = opts.glob ? (opts.glob as string[]).concat("!node_modules") : false;
  const srcDir = opts.dir
    ? posix.join(process.cwd(), opts.dir)
    : monoRepoPackages
    ? posix.join(process.cwd(), "packages/**/src")
    : posix.join(process.cwd(), "src");
  const testDir = monoRepoPackages ? "packages/**/test[s]{0,1}" : `test[s]{0,1}`;
  /** default glob pattern which includes index files in _source_ and _test_ directories */
  let defaultIndexGlob = globInclude || [`${srcDir}/**/index.[tj]s`, `${testDir}/**index.[tj]s`];
  let pathsToIndexFiles = (await globby(defaultIndexGlob.concat("!**/node_modules"))).filter((fp) =>
    isAutoindexFile(fp)
  );

  /**
   * The packages in a monorepo that _have_ autoindex files
   */
  const pkgsWithIndexFiles = monoRepoPackages
    ? Array.from(
        pathsToIndexFiles.reduce((acc, globPath) => {
          const [_, pkg] = /^.*packages\/(\S*?)\/.*\//.exec(globPath);
          acc.add(pkg);
          return acc;
        }, new Set<string>())
      )
    : false;

  let whichPackage: string;
  if (monoRepoPackages && pkgsWithIndexFiles) {
    whichPackage = opts.all ? "ALL" : await askHowToHandleMonoRepoIndexing(pkgsWithIndexFiles);
    if (whichPackage !== "ALL") {
      pathsToIndexFiles = pathsToIndexFiles.filter((p) => p.includes(`packages/${whichPackage}`));
    }
  }

  const results = await processFiles(pathsToIndexFiles, opts);
  if (!opts.quiet) {
    console.log();
  }

  if (opts.watch) {
    const watchGlob = pathsToIndexFiles.map((p) => {
      const parts = p.replace(/\\/g, "/").replace(process.cwd(), "").split("/");
      return relativePath(posix.join(...parts.slice(0, parts.length - 1), "*.ts"), process.cwd());
    });

    const ignored = pathsToIndexFiles.map((p) => {
      const parts = p.split(/[\/\\]/);
      return relativePath(
        posix.join(...parts.slice(0, parts.length - 1), "node_modules/**"),
        process.cwd()
      );
    });
    const log = console.log.bind(console);
    const h = watchHandlers(pathsToIndexFiles, log);
    const watcher = watch(watchGlob, {
      ignored,
      persistent: true,
      usePolling: true,
      interval: 100,
    });
    const status = { ready: false };
    watcher.on("ready", (...args: any[]) => {
      const pkgMessage = pkgsWithIndexFiles
        ? pkgsWithIndexFiles && whichPackage !== "ALL"
          ? `; focused only on the "${whichPackage}" package.`
          : chalk`; across {yellow {bold ${String(pkgsWithIndexFiles.length)}}} packages`
        : "";
      log(
        chalk`- watcher has started watching {bold {yellow ${String(
          pathsToIndexFiles.length
        )}}} directories${pkgMessage}`
      );
      watcher.on("add", h("added", status));
      watcher.on("change", h("changed", status));
      watcher.on("unlink", h("removed", status));
      watcher.on("link", h("added", status));
      watcher.on("addDir", h("added directory", status));
      watcher.on("unlinkDir", h("removed directory", status));
    });
    watcher.on("error", (e) => {
      log(`Error occurred: ${e.message}`);
    });
  }
}
