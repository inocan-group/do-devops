import chalk = require("chalk");
import { confirmQuestion } from "../../../shared";
import { ask } from "../../../shared/interactive/ask";

export interface ISsmNameHints {
  stage?: string;
  version?: string;
}

/**
 * Generates the name of the SSM variable where the user typically just puts in the core name
 * and the stage and version must be determined.
 *
 * @param name
 * @param hints
 */
export async function completeSsmName(
  name: string,
  hints: ISsmNameHints = {}
): Promise<string> {
  const parts = name.split("/");
  const lastIsUpper = parts.slice(-1)[0].toUpperCase() === parts.slice(-1)[0];

  if (!lastIsUpper) {
    console.log(
      chalk`\n- The last component of the name is intended -- {italic by convention} -- to be UPPERCASE.\n  Therefore we will convert your name to ${nameToUpper(
        parts
      )} with your permission.\n`
    );
    const answer = await ask(confirmQuestion({ name: "continue", message: "Continue?" }));
    if (!answer.continue) {
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
        chalk`\nThe SSM variable {italic name} does not appear to be correctly formatted. The format\nshould be:\n`
      );
      console.log(
        chalk`/{dim [stage]}/{dim [version]}/{dim [moduleName]}/{dim [VAR NAME]}\n`
      );
      console.log(
        chalk`In most cases the best strategy is just to state the module name and final\nvariable name and let the autocomplete do the rest.`
      );

      process.exit(1);
    }
  }
}

function nameToUpper(parts: string[]) {
  return [...parts.slice(0, parts.length - 1), parts.slice(-1)[0].toUpperCase()].join(
    "/"
  );
}
