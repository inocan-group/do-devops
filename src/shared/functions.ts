import fg from "fast-glob";
import path from "path";
import { IDictionary } from "common-types";
import { emoji } from "./emoji";
import { writeFileSync } from "fs";
/**
 * **findFunctionConfigurations**
 *
 * Looks through `${PWD}/src` directory to find `*.defn.ts` files which will be registered
 * as serverless configuration files.
 *
 * @param basePath you can optionally express where to start looking for config files
 * instead of the default of `${PWD}/src`
 */
export function findFunctionConfigurations(basePath?: string) {
  const glob =
    path.join(basePath, "**/*.defn.ts") ||
    path.join(process.env.PWD, "/src/**/*.defn.ts");
  return fg.sync([glob]) as string[];
}

export interface IFunctionDictionary {
  /** full path to the handler files */
  filePath: string;
  /** the full path to the directory which has the handler and function files */
  fileDir: string;
  /** relative path to the handler and function files */
  relativePath: string;
  /** whether or not file is a valid serverless handler definition */
  validHandlerDefinition: boolean;
  /** the filename of the handler configuration */
  configFilename: string;
  /** the filename of the actual serverless function */
  fnFilename: string;
  /** serverless registered name */
  serverlessFn: string;
}

export async function createFunctionDictionary(rootPath?: string) {
  const root = rootPath || process.env.PWD;
  const fns = findFunctionConfigurations(rootPath || path.join(process.env.PWD, "/src"));
  const serverlessNameLookup = getNamespacedLookup(fns, root);
  const { valid, invalid } = await validateExports(fns);
  return fns.map(filePath => {
    return {
      filePath,
      fileDir: getFilePath(filePath),
      relativePath: reduceToRelativePath(root, filePath),
      validHandlerDefinition: valid.includes(filePath),
      configFilename: getFilenameWithoutExtension(filePath) + ".def.ts",
      fnFilename: getFilenameWithoutExtension(filePath) + ".ts",
      serverlessFn: serverlessNameLookup[filePath]
    } as IFunctionDictionary;
  });
}

/**
 * **writeServerlessFunctionExports**
 *
 * writes all serverless function definition/configurations to the
 * `serverless-config/functions.ts` file. This file will not only
 * export all function definitions but will also provide a typescript
 * **type** called `IDefinedServerlessFunction` which will be a set of
 * string names which are defined in the given repo
 *
 * @param basePath you may alternatively state a base file path to use
 * when looking for function definition files (aka, files named `*.defn.ts`)
 * @param output rather than exporting to the file `serverless-config/functions.ts` you
 * may state an alternative
 */
export async function writeServerlessFunctionExports(
  basePath: string = undefined,
  output: string = undefined
) {
  const root = basePath || process.env.PWD;
  const outputFilename =
    output || path.join(process.env.PWD, "/serverless-config/functions.ts");
  const functionDefns = findFunctionConfigurations(basePath).map(p =>
    reduceToRelativePath(root, p)
  );
  const dict = await createFunctionDictionary(basePath);
  let template = `##imports##\n\n##exports##\n\n##interface##`;

  template = template.replace(
    "##imports##",
    dict
      .map(
        i =>
          `${
            i.validHandlerDefinition
              ? `import ${i.serverlessFn} from '.${i.relativePath.replace(".ts", "")}';`
              : `// invalid handler definition for "${
                  i.serverlessFn
                }"; please check handler definition and then rebuild `
          }`
      )
      .join("\n")
  );

  template = template.replace(
    "##exports##",
    dict
      .filter(i => i.validHandlerDefinition)
      .map(i => `export { ${i.serverlessFn} };`)
      .join("\n")
  );

  template = template.replace(
    "##interface##",
    `export type IDefinedServerlessFunction = ` +
      dict
        .filter(i => i.validHandlerDefinition)
        .map(i => `'${i.serverlessFn}'`)
        .join(" | ")
  );

  writeFileSync(
    outputFilename,
    "/**\n * DO NOT CHANGE THIS FILE\n * (this file is automatically created)\n **/\n\n" +
      template
  );
}

/**
 * **reduceToRelativePath**
 *
 * Reduces the file path to just the relative path _beyond_ the passed in `root` path
 */
export function reduceToRelativePath(root: string, fullyQualifiedPath: string) {
  return fullyQualifiedPath.replace(root, "");
}

/**
 * **getFilePath**
 *
 * given a filepath, this function strips off the filename and returns just
 * the path which the file resides in.
 */
export function getFilePath(filePath: string) {
  const parts = filePath.split("/");
  return parts.slice(0, parts.length - 1).join("/");
}

/**
 * **getFilenameWithoutExtension**
 *
 * Given a path, filename, and extension (including `.def.ts` as an extension type);
 * this function will return just the filename component.
 */
export function getFilenameWithoutExtension(filePath: string) {
  return filePath
    .split("/")
    .pop()
    .split(".")[0];
}

/**
 * **validateExports**
 *
 * Given an array of file imports, returns a hash of `valid` and `invalid`
 * files based on whether they represent a valid Lambda Serverless handler
 * definition.
 */
export async function validateExports(fnDefns: string[]) {
  const valid: string[] = [];
  const invalid: string[] = [];

  for (const fn of fnDefns) {
    try {
      const imp = await import(fn);
      if (imp.default && Object.keys(imp.default).includes("handler")) {
        valid.push(fn);
      } else {
        invalid.push(fn);
      }
    } catch (e) {
      invalid.push(fn);
    }
  }

  return { valid, invalid };
}

/**
 * **getNamespacedFilename**
 *
 * Directories off of the "root/base" should be considered a "namespace" so that
 * function names do not collide as well as to ensure that a functions "context"
 * if fully captured by the name. For this reason a handler function named
 * `netlify/deployWebhook.ts` will be resolved to `service-name-[stage]-netlifyDeployWebhook`.
 *
 * This function is reponsible for providing a lookup hash who's keys are
 * the passed in
 */
export function getNamespacedLookup(fns: string[], basePath?: string) {
  const root = basePath ? path.resolve(basePath) : path.join(process.env.PWD, "/src");
  return fns.reduce(
    (acc, fn) => {
      const parts = fn
        .replace(root, "")
        .split("/")
        .filter(i => i);
      parts[parts.length - 1] = parts[parts.length - 1].replace(".defn.ts", "");
      acc[fn] = parts
        .map((p, i) => (i === 0 ? p : p.slice(0, 1).toUpperCase() + p.slice(1)))
        .join("");
      return acc;
    },
    {} as IDictionary
  );
}

/**
 * **getFunctionNames**
 *
 * Given a set of paths to function definition files, will return a
 * lookup hash which provides the "function name" as the output
 */
export function getFunctionNames(paths: string[]) {
  return paths.reduce(
    (acc, current) => {
      const filename = current
        .split("/")
        .pop()
        .replace(".defn.ts", "");

      acc[current] = filename;
      return acc;
    },
    {} as IDictionary<string>
  );
}

export function detectDuplicateFunctionDefinitions(lookup: IDictionary<string>) {
  const vals = Object.values(lookup);
  const found = [];
  const dups: Array<{ fn: string; message: string; locations: string[] }> = [];
  vals.forEach(fn => {
    if (!dups.map(i => i.fn).includes(fn)) {
      const locations = Object.keys(lookup).reduce(
        (acc, curr) => {
          if (lookup[curr] === fn) {
            acc.push(curr);
          }
          return acc;
        },
        [] as string[]
      );
      if (locations.length > 1) {
        dups.push({
          fn,
          message: `- ${emoji.angry}  the function "${fn}" is defined more than once [ ${
            locations.length
          } ]: ${locations.join(", ")}`,
          locations
        });
      }
    }
  });

  return dups;
}

export function functionList() {
  //
}
