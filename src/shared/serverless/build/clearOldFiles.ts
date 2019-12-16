import { existsSync } from "fs";
import { rm } from "async-shelljs";
import path from "path";

export function clearOldFiles() {
  const typeFile = path.join(process.env.PWD, "src/@types/fns.ts");
  const inlineFile = path.join(
    process.env.PWD,
    "serverless-config/functions/inline.ts"
  );
  const webpackFile = path.join(
    process.env.PWD,
    "serverless-config/functions/webpack.ts"
  );

  const files = [typeFile, inlineFile, webpackFile];

  files.forEach(f => {
    if (existsSync(f)) {
      rm(f);
    }
  });
}
