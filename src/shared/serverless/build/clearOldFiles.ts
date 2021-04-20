import path from "path";

import { existsSync } from "fs";
import { rm } from "async-shelljs";

export function clearOldFiles() {
  const typeFile = path.join(process.env.PWD || "", "src/@types/fns.ts");
  const inlineFile = path.join(
    process.env.PWD || "",
    "serverless-config/functions/inline.ts"
  );
  const webpackFile = path.join(
    process.env.PWD || "",
    "serverless-config/functions/webpack.ts"
  );

  const files = [typeFile, inlineFile, webpackFile];

  for (const f of files) {
    if (existsSync(f)) {
      rm(f);
    }
  }
}
