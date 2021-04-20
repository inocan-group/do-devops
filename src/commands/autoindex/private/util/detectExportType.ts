import { ExportType, IExportType } from "../index";

export function detectExportType(fileContent: string): IExportType {
  const defaultExport = /^\/\/\s*#autoindex:\s*default/;
  const namedOffsetExport = /^\/\/\s*#autoindex:\s*named-offset/;
  const offsetExport = /^\/\/\s*#autoindex:\s*offset/;
  if (defaultExport.test(fileContent)) {
    return ExportType.default;
  }
  if (namedOffsetExport.test(fileContent) || offsetExport.test(fileContent)) {
    return ExportType.namedOffset;
  }

  return ExportType.named;
}
