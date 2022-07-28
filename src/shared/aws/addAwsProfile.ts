import path from "node:path";
import { appendFileSync, readFileSync } from "node:fs";
import { IAwsProfile } from "../../@types";

/**
 * **addAwsProfile**
 *
 * adds a new profile to a user's `src/.aws/credentials` file
 */
export function addAwsProfile(name: string, profile: IAwsProfile) {
  const homedir = require("os").homedir();
  const filePath = path.join(homedir, ".aws/credentials");
  const fileContents = readFileSync(filePath, "utf-8");
  if (fileContents.includes(`[${name}]`)) {
    throw new Error(`The AWS profile "${name}" already exists, attempt to add it has failed!`);
  }
  let newProfile = `\n[${name}]\n`;
  for (const key of Object.keys(profile)) {
    newProfile += `${key} = ${profile[key as keyof typeof profile]}\n`;
  }
  appendFileSync(filePath, newProfile);
}
