import { START_REGION } from "../index";

/** replace an existing region block with a new one */
export function replaceRegion(fileContent: string, regionContent: string) {
  const re = new RegExp(`${START_REGION}.*`, "gs");

  return fileContent.replace(re, regionContent);
}
