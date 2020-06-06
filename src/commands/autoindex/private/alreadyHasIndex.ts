import { END_REGION, START_REGION } from "./index";

/** indicates whether the given file already has a index region defined */
export function alreadyHasIndex(fileContent: string) {
  return fileContent.includes(START_REGION) && fileContent.includes(END_REGION);
}
