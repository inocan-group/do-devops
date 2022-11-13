import path from "node:path";
import { existsSync } from "node:fs";
import { homedir } from "node:os";

/**
 * Returns the path to the file if found, if not found then returns
 * `false`.
 */
export function hasAwsProfileCredentialsFile() {
  const filePath = path.join(homedir(), ".aws/credentials");
  return existsSync(filePath) ? filePath : false;
}
