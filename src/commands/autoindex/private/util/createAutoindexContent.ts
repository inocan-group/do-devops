import { DevopsError } from "~/errors";
import { IAutoindexOptions } from "../../parts";
import {
  AUTOINDEX_INFO_MSG,
  defaultExports,
  END_REGION,
  ExportType,
  IAutoindexFile,
  namedExports,
  namedOffsetExports,
  START_REGION,
  timestamp,
} from "../index";
import { generateSfcExports } from "../export-formats/generateSfcExports";
import { Options } from "~/@types/global";

export function createAutoindexContent(
  indexFile: IAutoindexFile,
  opts: Options<IAutoindexOptions>
) {
  let autoIndexContent = "";

  switch (indexFile.exportType) {
    case ExportType.default:
      autoIndexContent = defaultExports(indexFile, opts);
      break;
    case ExportType.namedOffset:
      autoIndexContent = namedOffsetExports(indexFile, opts);
      break;
    case ExportType.named:
      autoIndexContent = namedExports(indexFile, opts);
      break;
    default:
      throw new DevopsError(`Unknown export type: ${indexFile.exportType}!`, "invalid-export-type");
  }

  return `${START_REGION}
${timestamp()}
// hash-code: ${indexFile.hashCode}

${autoIndexContent}
${generateSfcExports(indexFile, opts)}
${END_REGION}

${AUTOINDEX_INFO_MSG}
`;
}
