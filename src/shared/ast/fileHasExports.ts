import { Project } from "ts-morph";

export function fileHasExports(file: string) {
  const p = new Project();
  p.addSourceFileAtPath(file);
  const source = p.getSourceFileOrThrow(file);
  const assignments = source.getExportAssignments();
  const exp = source.getExportDeclarations();
  const variables = source.getVariableDeclarations().filter((d) => d.hasExportKeyword());
  const functions = source.getFunctions().filter((f) => f.hasExportKeyword());

  const count = assignments.length + variables.length + functions.length + exp.length;

  return count > 0;
}
