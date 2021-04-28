import { IOptionDefinition } from "~/@types/option-types";

export interface IBuildOptions {
  force: boolean;
  alias: boolean;
}

export const options: IOptionDefinition = {
  force: {
    type: Boolean,
    group: "local",
    description: "forces the transpiling of code when building a serverless project",
  },
  interactive: {
    alias: "i",
    type: Boolean,
    group: "local",
    description: "allows choosing the functions interactively",
  },
};
