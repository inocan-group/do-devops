import chalk from "chalk";
import { existsSync, readFileSync } from "node:fs";
import parse from "destr";

import { IDictionary } from "common-types";
import { emoji } from "src/shared/ui";
import path from "node:path";

/**
 * returns the `.yo-rc.json` file combined with the
 * `.yo-transient.json` should they exist.
 *
 * Will always return a dictionary of some sort (even
 * if it's an empty dictionary)
 */
export function getYeomanConfig(scaffold = "generator-lambda-typescript") {
  const yoFile = path.posix.join(process.cwd(), ".yo-rc.json");
  const transientFile = path.posix.join(process.cwd(), ".yo-transient.json");
  const hasYo = existsSync(yoFile);
  const hasTransient = existsSync(transientFile);

  let yo: IDictionary = {};
  let transient: IDictionary = {};

  if (hasYo) {
    try {
      yo = parse(readFileSync(yoFile, "utf-8"))[scaffold];
    } catch {
      console.log(
        chalk`- there appears to {italic be} a yeoman config file but it could not be parsed ${emoji.poop}`
      );
      console.log(
        chalk`{grey - Note: we are looking for the "${scaffold}" as a root property, other yeoman scaffoldings are not considered}`
      );
    }
  }

  if (hasTransient) {
    try {
      transient = parse(readFileSync(transientFile, "utf-8"));
    } catch {
      console.log(
        chalk`- there appears to be a {italic transient} yeoman config file -- {blue .yo-transient.json} -- but it could not be parsed ${emoji.poop}`
      );
    }
  }

  return { ...transient, ...yo };
}
