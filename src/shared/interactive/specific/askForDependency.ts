import { DoDevopObservation, INpmDep, INpmDependencies, INpmDepProperty } from "src/@types";
import { askListQuestion } from "src/shared/interactive";
import chalk from "chalk";
import { dependencies } from "src/shared/npm";

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
  ].filter(Boolean) as {
    name: string;
    value: INpmDepProperty;
  }[];

export async function askForDependency(
  _observations: Set<DoDevopObservation>
): Promise<string | false> {
  const deps = dependencies();
  const choices = LOOKUP(deps).reduce(
    (acc, curr) => ({ ...acc, [curr.value]: curr.name }),
    {} as Record<string, string>
  );
  if (Object.keys(choices).length === 1) {
    console.log(`- this repo has no dependencies!`);
    return false;
  }

  const kind = (await askListQuestion(
    `Which {italic type} of dependency`,
    choices
  )) as keyof typeof deps;

  if (!kind) {
    return false;
  }
  const depChoices = deps[kind] as INpmDep[];

  const answer = await askListQuestion(
    `- Choose the {italic specific} dependency to run "ls" on`,
    Object.fromEntries(depChoices.map((i) => [i.name, `${i.name} {dim - ${i.version}}`]))
  );

  return answer;
}
