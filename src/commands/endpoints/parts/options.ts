import { IOptionDefinition } from "~/@types/option-types";

export const options: IOptionDefinition = {
  profile: {
    type: String,
    typeLabel: "<profileName>",
    group: "local",
    description: "set the AWS profile explicitly",
  },
};
