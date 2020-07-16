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
  /** the export type used last time autoindex was run */
  exportType: string;
  /** the _exclusions_ included last time autoindex was run */
  exclusions: string[];
}

/**
 * Gets all meta information about the prior state of the file contents
 */
export function getExistingMetaInfo(fileContent: string): IExistingMetaInfo {
  const hasExistingMeta = alreadyHasAutoindexBlock(fileContent);
  const files = hasExistingMeta ? getFilesMeta(fileContent) : [];
  const dirs = hasExistingMeta ? getDirsMeta(fileContent) : [];
  const sfcs = hasExistingMeta ? getSFCsMeta(fileContent) : [];

  const exportType = hasExistingMeta ? getExportType(fileContent) : "";
  const exclusions = hasExistingMeta ? getExclusions(fileContent) : [];

  return { hasExistingMeta, files, dirs, sfcs, exportType, exclusions };
}

function getExportType(content: string): string {
  const matches = content.match(/\/\/ export: (.*)\;/);
  return Array.isArray(matches) ? matches[1].trim() : "";
}

function getExclusions(content: string): string[] {
  const matches = content.match(/\/\/ export: .*\; exclusions: (.*)\./);
  return Array.isArray(matches) ? matches[1].trim().split(", ") : [];
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
