import { directoryFiles } from "../../file/";

export function getTranspiledTimestamps(fns?: string[]) {
  const files = directoryFiles(".webpack");
  if (fns) {
    const relevantFiles = files.filter(i =>
      fns.includes(i.file.replace(".js", ""))
    );
    return fns.map(f => {
      const file = f.includes(".js") ? f : f + ".js";
      const foundInFiles = files.find(i => i.file === file);
      const timestamp = foundInFiles
        ? foundInFiles.stats.mtime
        : new Date("1970-01-01");
      return { file, timestamp };
    });
  }

  return files.map(i => {
    return { file: i.file, timestamp: i.stats.mtime };
  });
}
