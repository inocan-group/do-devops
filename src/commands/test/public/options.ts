import { IOptionDefinition } from "~/@types/option-types";

export const options: IOptionDefinition = {
  onSourceChanged: {
    type: Boolean,
    group: "local",
    description:
      "only run tests if the source files in the repo are changed from what is in git",
  },
};
