import { END_REGION, START_REGION } from "../index";

export function exportsHaveChanged(fileContent: string, regionContent: string) {
  const start = new RegExp(`${START_REGION}\n`, "gs");
  const end = new RegExp(`${END_REGION}\n`, "gs");
  const before = fileContent
    .replace(start, "")
    .replace(end, "")
    .split("\n")
    .filter((i) => i);
  // const after =
}
