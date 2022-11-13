import { getPackageJson, hasDevDependency } from "../npm";
import { LintObservation } from "src/@types/observations";
import { IDictionary } from "common-types";
import parse from "destr";
import { fileExists, readFile } from "../file";

export interface ILinterInfo {
  config: IDictionary;
  filename: string;
}

export interface IObservedLinters {
  observations: Set<LintObservation>;
  tslint: boolean | ILinterInfo;
  eslint: boolean | ILinterInfo;
  prettier: boolean | String;
}

/**
 * Looks for linters by interrogating the `package.json` as well as looking for
 * configuration files.
 *
 * The two linters we're looking for are `eslint` and `tslint`. The return type
 * will be set to false if it looks like they're not present but if they _are_
 * present we will send back the configuration file as text if it can be found.
 */
export function determineLinter(): IObservedLinters {
  const observations: Set<LintObservation> = new Set<LintObservation>();
  let eslint: IObservedLinters["eslint"] = false;
  let tslint: IObservedLinters["tslint"] = false;
  let prettier: IObservedLinters["prettier"] = false;
  const pkg = getPackageJson();

  if (pkg) {
    if (hasDevDependency("eslint")) {
      observations.add("eslint");

      if (hasDevDependency("@typescript-eslint/eslint-plugin")) {
        observations.add("typescriptEslintPlugin");
      }
      if (hasDevDependency("@typescript-eslint/parser")) {
        observations.add("typescriptEslintParser");
      }

      if (pkg.eslintConfig) {
        observations.add("eslintConfig");
        eslint = { config: parse(pkg.eslintConfig), filename: "package.json" };
      } else {
        for (const filename of [".eslintrc", ".eslintrc.js", ".eslintrc.ts"]) {
          const fileContent = readFile(filename);
          eslint = { config: parse(fileContent), filename };
        }
      }
    }

    if (hasDevDependency("tslint")) {
      observations.add("tslint");

      const fileContent = readFile("tslint.json");
      tslint = fileContent ? { config: parse(fileContent), filename: "tslint.json" } : true;
    }

    if (hasDevDependency("prettier")) {
      observations.add("prettier");

      if (fileExists(".prettierrc")) {
        prettier = readFile(".prettierrc") || false;
      }
    }
    if (hasDevDependency("eslint-prettier-plugin")) {
      observations.add("eslintPrettierPlugin");
    }
  }

  return { observations, eslint, tslint, prettier };
}
