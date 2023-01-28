/* eslint-disable unicorn/no-process-exit */
import chalk from "chalk";
import { DevopsError } from "src/errors";
import { askConfirmQuestion } from "src/shared/interactive";

export interface ISsmNameHints {
  stage?: string;
  version?: string;
}

function nameToUpper(parts: string[]) {
  return [...parts.slice(0, -1), parts.slice(-1)[0].toUpperCase()].join("/");
}

/**
 * Generates the name of the SSM variable where the user typically just puts in the core name
 * and the stage and version must be determined.
 *
 * @param name
 * @param hints
 */
export async function completeSsmName(name: string, hints: ISsmNameHints = {}) {
  const parts = name.split("/");
  const lastIsUpper = parts.slice(-1)[0].toUpperCase() === parts.slice(-1)[0];

  if (!lastIsUpper) {
    console.log(
      `\n- The last component of the name is intended -- ${chalk.italic`by convention`} -- to be UPPERCASE.\n  Therefore we will convert your name to ${nameToUpper(
        parts
      )} with your permission.\n`
    );
    const cont = await askConfirmQuestion("Continue?");
    if (!cont) {
      console.log();
      process.exit();
    }
  }
  if (parts.length === 2) {
    // we just got the type/SUB_TYPE so add in stage and version from hints or default to sensible defaults
    return `/${hints.stage || "dev"}/${hints.version || 1}/${nameToUpper(parts)}`;
  }
  if (parts.length > 2) {
    if (Number.isInteger(parts[1])) {
      return nameToUpper(parts);
    } else {
      console.log(
        `\nThe SSM variable ${chalk.italic`name`} does not appear to be correctly formatted. The format\nshould be:\n`
      );
      console.log(`/${chalk.dim` [stage]`}/${chalk.dim` [version]`}/${chalk.dim` [moduleName]`}/${chalk.dim` [VAR NAME]`}\n`);
      console.log(
        `In most cases the best strategy is just to state the module name and final\nvariable name and let the autocomplete do the rest.`
      );

      throw new DevopsError("Incorrect SSM variable formatting", "ssm/invalid-format");
    }
  }
  throw new DevopsError("Incorrect SSM variable structure", "ssm/invalid-structure");
}
