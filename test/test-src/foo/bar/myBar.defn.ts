import { IServerlessFunction } from "common-types";

const fn: IServerlessFunction = {
  handler: "this/must/exist.handler",
  description: "this is a test serverless function config"
};

export default fn;
