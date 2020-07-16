import { IDictionary } from "common-types";
import { alreadyHasAutoindexBlock } from "./alreadyHasAutoindexBlock";

export interface IExistingMetaInfo {
  hasExistingMeta: boolean;
  /** all files found to already exist as exports */
  files: string[];
  /** all dirs found to already exist as exports */
  dirs: string[];
  /** all SFCs found to already exist as exports */
  sfcs: string[];
}

/**
 * Gets all meta information about the prior state of the file contents
 */
export function getExistingMetaInfo(fileContent: string): IExistingMetaInfo {
  const hasExistingMeta = alreadyHasAutoindexBlock(fileContent);
  const files = hasExistingMeta ? getFilesMeta(fileContent) : [];
  const dirs = hasExistingMeta ? getDirsMeta(fileContent) : [];
  const sfcs = hasExistingMeta ? getSFCsMeta(fileContent) : [];

  return { hasExistingMeta, files, dirs, sfcs };
}

function getFilesMeta(content: string): string[] {
  const matches = content.match(/\/\/ files: (.*)\./);
  return Array.isArray(matches) ? matches[1].trim().split(", ") : [];
}

function getDirsMeta(content: string): string[] {
  const matches = content.match(/\/\/ directories: (.*)\./);
  return Array.isArray(matches) ? matches[1].trim().split(", ") : [];
}

function getSFCsMeta(content: string): string[] {
  const matches = content.match(/\/\/ SFCs: (.*)\./);
  return Array.isArray(matches) ? matches[1].trim().split(", ") : [];
}
