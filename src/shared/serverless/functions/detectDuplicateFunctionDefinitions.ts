import { IDictionary } from "common-types";
import { emoji } from "~/shared/ui";

export function detectDuplicateFunctionDefinitions(lookup: IDictionary<string>) {
  const vals = Object.values(lookup);
  const dups: Array<{ fn: string; message: string; locations: string[] }> = [];
  for (const fn of vals) {
    if (!dups.map((i) => i.fn).includes(fn)) {
      const locations = Object.keys(lookup).reduce((acc, curr) => {
        if (lookup[curr] === fn) {
          acc.push(curr);
        }
        return acc;
      }, [] as string[]);
      if (locations.length > 1) {
        dups.push({
          fn,
          message: `- ${emoji.angry}  the function "${fn}" is defined more than once [ ${
            locations.length
          } ]: ${locations.join(", ")}`,
          locations,
        });
      }
    }
  }

  return dups;
}
