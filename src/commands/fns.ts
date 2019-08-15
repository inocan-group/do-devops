import {
  findInlineFunctionDefnFiles,
  findConfigFunctionDefnFiles,
  getExportsFromFile,
  isTypescriptMicroserviceProject,
  getServerlessYaml,
  isServerless
} from "../shared";
import { IDictionary } from "common-types";

export async function handler(args: string[], opt: IDictionary) {
  const status = isServerless();
  if (!status) {
    console.log("- this project does not appear to be a Serverless project!\n");
    process.exit();
  } else if (status.isUsingTypescriptMicroserviceTemplate) {
    // await rebuildTypescriptMicroserviceProject();
  }

  try {
    const functions = (await getServerlessYaml()).functions;
  } catch (e) {
    console.log(`- Error finding functions: ${e.message}\n`);
    process.exit();
  }
  // const inlineFns = await findInlineFunctionDefnFiles();
  // const configFiles = await findConfigFunctionDefnFiles();
  // console.log(inlineFns);
  // console.log(configFiles);
  // for await (const fn of inlineFns) {
  //   console.log(fn, fn.replace(process.env.PWD, ""));

  //   const e = await getExportsFromFile(fn);
  //   console.log(e);
  // }
}
