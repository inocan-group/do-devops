import { ExportType, IExportType } from "../index";

export function detectExportType(fileContent: string): IExportType {
  const defaultExport = /autoindex:default/;
  const namedOffsetExport = /autoindex:named\-offset/;
  if (defaultExport.test(fileContent)) {
    return ExportType.default;
  }
  if (namedOffsetExport.test(fileContent)) {
    return ExportType.namedOffset;
  }

  return ExportType.named;
}
