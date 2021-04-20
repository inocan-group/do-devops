import { END_REGION, START_REGION } from "../index";

/** replace an existing region block with a new one */
export function replaceRegion(fileContent: string, regionContent: string) {
  const re = new RegExp(`${START_REGION}.*${END_REGION}\n.*`, "gs");
  return fileContent.replace(re, regionContent + "\n");
}
