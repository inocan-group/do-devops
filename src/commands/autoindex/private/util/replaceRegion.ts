import { END_REGION, START_REGION, timestamp } from "../index";

/** replace an existing region block with a new one */
export function replaceRegion(fileContent: string, regionContent: string) {
  // const replacementContent = `${START_REGION}\n${timestamp()}${regionContent}\n${END_REGION}\n`;
  const re = new RegExp(`${START_REGION}.*${END_REGION}`, "gs");
  return fileContent.replace(re, regionContent);
}
