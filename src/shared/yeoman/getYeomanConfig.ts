import { existsSync, readFileSync } from "fs";

import { IDictionary } from "common-types";
import { emoji } from "../../private";
import { join } from "path";

import chalk = require("chalk");

/**
 * returns the `.yo-rc.json` file combined with the
 * `.yo-transient.json` should they exist.
 *
 * Will always return a dictionary of some sort (even
 * if it's an empty dictionary)
 */
export function getYeomanConfig(scaffold = "generator-lambda-typescript") {
  const yoFile = join(process.cwd(), ".yo-rc.json");
  const transientFile = join(process.cwd(), ".yo-transient.json");
  const hasYo = existsSync(yoFile);
  const hasTransient = existsSync(transientFile);

  let yo: IDictionary = {};
  let transient: IDictionary = {};

  if (hasYo) {
    try {
      yo = JSON.parse(readFileSync(yoFile, "utf-8"))[scaffold];
    } catch (e) {
      console.log(chalk`- there appears to {italic be} a yeoman config file but it could not be parsed ${emoji.poop}`);
      console.log(
        chalk`{grey - Note: we are looking for the "${scaffold}" as a root property, other yeoman scaffoldings are not considered}`
      );
    }
  }

  if (hasTransient) {
    try {
      transient = JSON.parse(readFileSync(transientFile, "utf-8"));
    } catch (e) {
      console.log(
        chalk`- there appears to be a {italic transient} yeoman config file -- {blue .yo-transient.json} -- but it could not be parsed ${emoji.poop}`
      );
    }
  }

  return { ...transient, ...yo };
}
