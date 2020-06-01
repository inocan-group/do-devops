import * as path from "path";

import { appendFileSync, readFileSync } from "fs";

import { IAwsProfile } from "../../@types";

/** adds a new profile to a user's `~/.aws/credentials` file */
export function addAwsProfile(name: string, profile: IAwsProfile) {
  const homedir = require("os").homedir();
  const filePath = path.join(homedir, ".aws/credentials");
  const fileContents = readFileSync(filePath, "utf-8");
  if (fileContents.includes(`[${name}]`)) {
    throw new Error(`The AWS profile "${name}" already exists, attempt to add it has failed!`);
  }
  let newProfile = `\n[${name}]\n`;
  Object.keys(profile).forEach((key: string & keyof typeof profile) => {
    newProfile += `${key} = ${profile[key]}\n`;
  });
  appendFileSync(filePath, newProfile);
}
