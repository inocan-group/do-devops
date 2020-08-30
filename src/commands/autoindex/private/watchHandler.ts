import chalk = require("chalk");
import { IDictionary } from "common-types";
import { Stats } from "fs";
import { processFiles } from "./processFiles";

type logging = (message?: any, ...optionalParams: any[]) => void;
export function watchHandlers(indexFiles: string[], log: logging) {
  return (evt: string, status: { ready: boolean }) => {
    return (path: string, stats: Stats) => {
      const isMonoRepo = path.startsWith("packages");
      const pkg = isMonoRepo ? path.split("/")[1] : undefined;
      const file = path.split("/").pop();
      const verbLookup: IDictionary = {
        changed: "changed",
        added: "added",
        removed: "removed",
      };
      const verb = Object.keys(verbLookup).includes(evt) ? verbLookup[evt] : "unknown";
      const message = isMonoRepo
        ? chalk`- the file {blue ${file}} in package {italic ${pkg}} was ${evt}`
        : chalk`- the file {blue ${file}} was ${evt}`;
      log(message);
      const files = isMonoRepo
        ? indexFiles.filter((p) => p.includes(`packages/${pkg}`))
        : indexFiles;
      processFiles(files, { quiet: true });
    };
  };
}
