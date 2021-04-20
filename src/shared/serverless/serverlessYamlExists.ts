import { existsSync } from "fs";
import path from "path";

export function serverlessYamlExists() {
  return existsSync(path.posix.join(process.cwd(), "serverless.yml"));
}
