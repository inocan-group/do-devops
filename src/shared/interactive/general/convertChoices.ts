import { ChoiceOptions } from "inquirer";
import { Choices } from "src/@types";

export function convertChoices<C extends Choices>(choices: C): ChoiceOptions[] {
  return (
    Array.isArray(choices)
      ? choices.map((c) => ({
          type: "choice",
          name: String(c),
          value: c,
        }))
      : Object.keys(choices).reduce<ChoiceOptions[]>((acc, key) => {
          return [
            ...acc,
            {
              type: "choice",
              name: String(choices[key as keyof typeof choices]),
              value: key,
            },
          ];
        }, [])
  ) as ChoiceOptions[];
}
