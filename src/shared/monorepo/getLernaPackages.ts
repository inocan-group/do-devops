/* eslint-disable unicorn/import-style */
import { asyncExec } from "async-shelljs";
import chalk from "chalk";
import { semver } from "common-types";
import parse from "destr";
import { join } from "node:path";
import { DevopsError } from "src/errors";
import { currentDirectory, fileExists } from "../file";

export interface ILernaPackage {
  name: string;
  version: semver;
  private: boolean;
  location: string;
}

function stripExtraneous(input: string) {
  const re = /.*(\[.*]).*/s;
  const [_, interior] = [...(input.match(re) || [])];
  return interior;
}

export async function getLernaPackages(dir?: string) {
  dir = dir ? dir : currentDirectory();
  const lerna = join(dir, "node_modules/.bin/lerna");
  if (!fileExists(lerna)) {
    throw new DevopsError(
      chalk`Attempt to get {bold green Lerna} package list failed as the Lerna command was not found locally at: {blue ${lerna}}`,
      "not-ready/lerna-missing"
    );
  }

  const pkgs = parse(
    stripExtraneous(await asyncExec(`node_modules/.bin/lerna list --json`, { silent: true }))
  ) as ILernaPackage[];
  return pkgs || [];
}
