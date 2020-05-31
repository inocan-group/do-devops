import { existsSync } from "fs";
import { join } from "path";

export function serverlessYamlExists() {
  return existsSync(join(process.cwd(), "serverless.yml"));
}
