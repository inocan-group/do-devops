import path from "path";
import { existsSync } from "fs";

/**
 * Returns the path to the file if found, if not found then returns
 * `false`.
 */
export function hasAwsProfileCredentialsFile() {
  const homedir = require("os").homedir();
  const filePath = path.join(homedir, ".aws/credentials");
  return existsSync(filePath) ? filePath : false;
}
