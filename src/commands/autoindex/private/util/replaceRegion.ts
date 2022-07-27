import { OLD_START_REGION, START_REGION } from "../index";

/** replace an existing region block with a new one */
export function replaceRegion(fileContent: string, regionContent: string) {
  const startRegion = new RegExp(`${START_REGION}.*`, "gs");
  const oldStartRegion = new RegExp(`${OLD_START_REGION}.*`, "gs");
  const re = startRegion.test(fileContent) ? startRegion : oldStartRegion;

  return fileContent.replace(re, regionContent);
}
