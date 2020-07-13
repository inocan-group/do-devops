import { git } from "./index";
export async function gitTags(baseDir?: string) {
  baseDir = baseDir ? baseDir : process.cwd();
  const g = git(baseDir);
  return g.tags();
}
