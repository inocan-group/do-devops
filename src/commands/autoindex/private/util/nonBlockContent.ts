import { END_REGION, START_REGION } from "../reference";

/**
 * returns the content, _excluding_ the blocked content generated by this command
 */
export function nonBlockContent(content: string) {
  const re = new RegExp(`${START_REGION}.*${END_REGION}`, "s");
  return content.replace(re, "");
}
