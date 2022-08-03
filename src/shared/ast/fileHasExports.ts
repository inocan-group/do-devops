import { Project } from "ts-morph";

export function fileHasExports(file: string) {
  try {
    const p = new Project();
    p.addSourceFileAtPath(file);
    const source = p.getSourceFileOrThrow(file);
    const assignments = source.getExportAssignments();
    const exp = source.getExportDeclarations();
    const variables = source.getVariableDeclarations().filter((d) => d.hasExportKeyword());
    const functions = source.getFunctions().filter((f) => f.hasExportKeyword());
    const types = source.getTypeAliases().filter((f) => f.isExported());

    const count =
      assignments.length + variables.length + functions.length + exp.length + types.length;

    return count > 0;
  } catch (error) {
    throw new Error(`Problems checking whether ${file} has exports: ${(error as Error).message}`);
  }
}
