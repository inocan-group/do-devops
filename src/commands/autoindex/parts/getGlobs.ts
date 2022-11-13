import { FSWatcher } from "chokidar";
import { globby } from "globby";
import { join } from "node:path";
import { cwd } from "node:process";
import { getProjectConfig } from "src/shared/config/getProjectConfig";
import { getMonoRepoPackages } from "src/shared/file/getMonoRepoPackages";
import { isAutoindexFile } from "../private";
import { IAutoindexOptions } from "./options";

export interface GlobPatterns {
  path: string;
  name: string;
  indexGlobs: string[];
  contentGlobs: string[];
}

export interface AutoindexGroupDefinition extends GlobPatterns {
  kind: string;

  indexFiles: string[];
  contentFiles: string[];
  nonAutoindexFiles: string[];

  indexWatcher?: FSWatcher;
  contentWatcher?: FSWatcher;
}

/**
 * never accept `node_modules` or the `index.ts`/`index.js` file in the current directory
 */
export const REQUIRED_BLACKLIST = [
  "**/node_modules/**",
  "**/index.ts",
  "**/index.js",
  "**/index.cjs",
  "**/index.mjs",
];

export const INDEX_LIST_DEFAULTS = [
  "**/index.ts",
  "**/index.js",
  "**/index.mjs",
  "**/index.cjs",
  "!**/node_modules",
  "!**/dist",
];
export const WHITE_LIST_DEFAULTS = ["src/**/*.ts", "src/**/*.js"];
export const BLACK_LIST_DEFAULTS = ["**/*.d.ts", "packages/**/*", "dist/**", ".webpack/**"];

export interface AutoindexMeta {
  indexGlobs: string[];
  indexFiles: string[];
  /**
   * the files which met the `indexGlobs` patterns but were not
   * configured to be auto indexed
   */
  nonAutoindexFiles: string[];
}

/**
 * Returns the index files found in the given package.
 *
 * If the package is ROOT package then all directory paths to other
 * packages will automatically be excluded.
 */
export async function getIndex(
  path: string,
  _opts: Partial<IAutoindexOptions>
): Promise<AutoindexMeta> {
  const packages = await getMonoRepoPackages(path);
  const isRoot = path === ".";
  const exclusions = isRoot
    ? packages.filter((i) => i.path !== ".").map((i) => `!${i.path}/**`)
    : [];
  const indexGlobs = [...INDEX_LIST_DEFAULTS, ...exclusions];
  const nonAutoindexFiles: string[] = [];
  // eslint-disable-next-line unicorn/no-await-expression-member
  const indexFiles = (await globby(indexGlobs, { onlyFiles: true, cwd: join(cwd(), path) })).filter(
    (f) => {
      if (isAutoindexFile(f)) {
        return true;
      } else {
        nonAutoindexFiles.push(f);
        return false;
      }
    }
  );

  return { indexFiles, indexGlobs, nonAutoindexFiles };
}

/**
 * Returns an array of files off the base directory passed in which should
 * be considered for the given "package".
 *
 * NOTE: we are moving away from the use of this! there are better way's to
 * pick off content files
 */
export async function getContent(
  dir: string,
  opts: Partial<IAutoindexOptions>
): Promise<{
  contentGlobs: string[];
  contentFiles: string[];
}> {
  const projectConfig = opts.explicitFiles ? getProjectConfig(".") : getProjectConfig(dir);

  const whiteGlobs = [
    ...(projectConfig.autoindex?.whitelistGlobs || WHITE_LIST_DEFAULTS),
    ...(opts.sfc ? ["**/*.vue"] : []),
  ];
  const blackGlobs = [
    ...(projectConfig.autoindex?.blacklistGlobs || BLACK_LIST_DEFAULTS),
    ...REQUIRED_BLACKLIST,
  ].map((i) => (i.startsWith("!") ? i : `!${i}`));

  const contentGlobs = [...whiteGlobs, ...blackGlobs];
  const contentFiles = await globby(contentGlobs, {
    onlyFiles: true,
    cwd: join(cwd(), dir),
  });

  return { contentFiles, contentGlobs };
}
