import { OptionDefinition } from "command-line-usage";

export const options: OptionDefinition[] = [
  {
    name: "onSourceChanged",
    type: Boolean,
    group: "test",
    description: "only run tests if the source files in the repo are changed from what is in git",
  },
];
