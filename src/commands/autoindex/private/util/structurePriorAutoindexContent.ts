import { END_REGION, ExportAction, START_REGION } from "../index";

import { ExportType } from "../reference";

export function structurePriorAutoindexContent(content: string) {
  // const timestamp = ``
  const re = new RegExp(`(${START_REGION}.*([^\0]*).*${END_REGION})`, "g");
  const contentBlock = content.replace(re, "$2");
  const lines = contentBlock.split("\n");
  const exportLines = lines.filter((i) => i.slice(0, 6) === "export");
  const symbols = exportLines.map((i) => i.replace(/(.*"\.\/(.\w*).*)/, "$2"));
  const exportType = exportLines.length === 0 ? "unknown" : getType(exportLines);
  const timestamp = lines
    .filter((i) => i.includes("// indexed at:"))
    .map((i) => i.replace(/(.*indexed at:\s*)(.*)$/, "$2"));
  return { exportType, symbols, quantity: symbols.length, timestamp };
}

function getType(exportLines: string[]) {
  return exportLines[0].includes("* as ")
    ? ExportType.namedOffset
    : exportLines[0].includes("{ default as ")
    ? ExportType.default
    : ExportType.named;
}
