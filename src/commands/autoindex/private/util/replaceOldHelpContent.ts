import { AUTOINDEX_INFO_MSG } from "../reference";

export function hasOldHelpContent(content: string) {
  return content.includes("// This file was created by") ? true : false;
}

export function replaceOldHelpContent(content: string) {
  return hasOldHelpContent(content)
    ? content.replace(/\/\/ This file was created by.*/, AUTOINDEX_INFO_MSG)
    : content;
}
