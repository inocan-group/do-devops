import { IOptionDefinition } from "src/@types/option-types";

export const description =
  "invoke serverless functions locally, leveraging test data where desired";

export const options: IOptionDefinition = {
  stage: {
    type: String,
    typeLabel: "<stage>",
    group: "local",
    description: 'state the "stage" you want to emulate with invokation',
  },
  data: {
    type: String,
    typeLabel: "<dataFile>",
    group: "local",
    description: "use a known data input",
  },
  interactive: {
    alias: "i",
    type: Boolean,
    group: "local",
    description: "bring up an interactive dialog to choose the data file",
  },
};

export interface IInvokeOptions {
  stage: string;
  data: string;
  interactive: boolean;
}
