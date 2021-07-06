import { datetime } from "common-types";
import { DefaultLogFields, LogOptions } from "simple-git";
import { git } from "./git";

export interface IGitLogEntry {
  hash: string;
  date: datetime;
  message: string;
  refs: string;
  body: string;
  author_name?: string;
  author_email?: string;
}

export interface IGitLog {
  all: IGitLogEntry[];
  latest: IGitLogEntry;
  total: number;
}

/**
 * Returns the git logs of a repo
 */
export async function getGitLog(opts: LogOptions<DefaultLogFields> = {}, baseDir?: string) {
  baseDir = baseDir ? baseDir : process.cwd();
  return git(baseDir).log(opts);
}