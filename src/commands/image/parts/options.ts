import { OptionDefn } from "src/@types";

export const options: OptionDefn = {
  force: {
    alias: "f",
    type: Boolean,
    group: "local",
    description: `Force a full rebuild of the image cache as well as converted images`,
  },
};

export interface IImageOptions {
  /** Force a full rebuild of the image cache as well as converted images */
  force: boolean;
}
