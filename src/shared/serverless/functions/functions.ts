import path from "path";
import { findInlineFunctionDefnFiles } from "~/shared/serverless";
import { getFilePath, getNamespacedLookup, validateExports } from "./index";
import { writeFileSync } from "fs";
import { IServerlessFnDictionary } from "~/@types";

/**
 * **reduceToRelativePath**
 *
 * Reduces the file path to just the relative path _beyond_ the passed in `root` path
 */
export function reduceToRelativePath(root: string, fullyQualifiedPath: string) {
  return fullyQualifiedPath.replace(root, "");
}

/**
 * **getFilenameWithoutExtension**
 *
 * Given a path, filename, and extension (including `.def.ts` as an extension type);
 * this function will return just the filename component.
 */
export function getFilenameWithoutExtension(filePath: string) {
  return (filePath.split("/").pop() || "").split(".")[0];
}

export async function createFunctionDictionary(rootPath?: string) {
  const root = rootPath || process.env.PWD || "";
  const fns = findInlineFunctionDefnFiles(
    rootPath || path.join(process.env.PWD || "'", "/src")
  );
  const serverlessNameLookup = getNamespacedLookup(fns, root);
  const { valid } = await validateExports(fns);
  return fns.map((filePath) => {
    return {
      filePath,
      fileDir: getFilePath(filePath),
      relativePath: reduceToRelativePath(root, filePath),
      validHandlerDefinition: valid.includes(filePath),
      configFilename: getFilenameWithoutExtension(filePath) + ".def.ts",
      fnFilename: getFilenameWithoutExtension(filePath) + ".ts",
      serverlessFn: serverlessNameLookup[filePath],
    } as IServerlessFnDictionary;
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
export async function writeServerlessFunctionExports(basePath?: string, output?: string) {
  const outputFilename =
    output || path.join(process.env.PWD || "", "/serverless-config/functions.ts");

  // const functionDefns = findInlineFunctionDefnFiles(basePath).map((p) =>
  //   reduceToRelativePath(root, p)
  // );
  const dict = await createFunctionDictionary(basePath);
  let template = "##imports##\n\n##exports##\n\n##interface##";

  template = template.replace(
    "##imports##",
    dict
      .map(
        (i) =>
          `${
            i.validHandlerDefinition
              ? `import ${i.serverlessFn} from '.${i.relativePath.replace(".ts", "")}';`
              : `// invalid handler definition for "${i.serverlessFn}"; please check handler definition and then rebuild `
          }`
      )
      .join("\n")
  );

  template = template.replace(
    "##exports##",
    dict
      .filter((i) => i.validHandlerDefinition)
      .map((i) => `export { ${i.serverlessFn} };`)
      .join("\n")
  );

  template = template.replace(
    "##interface##",
    "export type IDefinedServerlessFunction = " +
      dict
        .filter((i) => i.validHandlerDefinition)
        .map((i) => `'${i.serverlessFn}'`)
        .join(" | ")
  );

  writeFileSync(
    outputFilename,
    "/**\n * DO NOT CHANGE THIS FILE\n * (this file is automatically created)\n **/\n\n" +
      template
  );
}
