import { DoDevopObservation, INpmDependencies, INpmDepProperty } from "~/@types";
import { askListQuestion } from "~/shared/interactive";
import chalk from "chalk";
import { dependencies } from "~/shared/npm";

export const LOOKUP = (p: INpmDependencies) =>
  [
    p.hasDependencies
      ? { value: "dependencies", name: `Dependencies [${p.dependencies.length}]` }
      : false,
    p.hasPeerDependencies
      ? {
          value: "peerDependencies",
          name: `Peer Dependencies [${p.peerDependencies.length}]`,
        }
      : false,
    p.hasOptionalDependencies
      ? {
          value: "optionalDependencies",
          name: `Optional Dependencies [${p.optionalDependencies.length}]`,
        }
      : false,
    p.hasDevDependencies
      ? {
          value: "devDependencies",
          name: `Development Dependencies [${p.devDependencies.length}]`,
        }
      : false,
    { value: false, name: "QUIT" },
  ].filter((i) => i) as {
    name: string;
    value: INpmDepProperty;
  }[];

export async function askForDependency(
  _observations: Set<DoDevopObservation>
): Promise<string | false> {
  const deps = dependencies();
  const choices = LOOKUP(deps);
  if (Object.keys(choices).length === 1) {
    console.log(`- this repo has no dependencies!`);
    return false;
  }

  const kind = await askListQuestion<INpmDepProperty>(
    chalk`Which {italic type} of dependency`,
    choices
  );

  if (!kind) {
    return false;
  }
  const depChoices = deps[kind];

  const answer = await askListQuestion<string>(
    chalk`- Choose the {italic specific} dependency to run "ls" on`,
    depChoices.map((i) => ({ value: i.name, name: chalk`${i.name} {dim - ${i.version}}` }))
  );

  return answer;
}
