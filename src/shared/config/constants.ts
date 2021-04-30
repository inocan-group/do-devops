import { IProjectConfig, IUserConfig } from "~/@types";

export const CONFIG_FILE = ".do-devops.json";
export const DEFAULT_USER_CONFIG: IUserConfig = {
  kind: "user",
  userConfig: true,
  general: {},
  aws: {},
};
export const DEFAULT_PROJECT_CONFIG: IProjectConfig = {
  kind: "project",
  projectConfig: true,
  general: {},
  aws: {},
};
