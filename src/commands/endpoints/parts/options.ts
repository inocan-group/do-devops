import { IOptionDefinition } from "~/@types/option-types";

export const options: IOptionDefinition = {
  profile: {
    type: String,
    typeLabel: "<profileName>",
    group: "local",
    description: "set the AWS profile explicitly",
  },
  region: {
    type: String,
    typeLabel: "<region>",
    group: "local",
    description: "set the AWS region explicitly",
  },
  interactive: {
    type: Boolean,
    group: "local",
    description:
      "if the AWS profile or region can't be determined, the CLI will interactively ask which to use",
  },
};

export interface IEndpointsOptions {
  profile: string;
  region: string;
  interactive: boolean;
}
