import { Project } from "ts-morph";

export function aboutDefaultExport(file: string) {
  const p = new Project();
  p.addSourceFileAtPath(file);
  const source = p.getSourceFileOrThrow(file);
  const assignments = source.getExportAssignments().map(ass => ({
    text: ass.getText(),
    expression: ass.getExpression().getText()
  }));
  const defaultExport = source.getExportDeclarations().find(exp => !exp.insertNamedExports);
  const variables = source.getVariableDeclarations().filter((d) => d.hasExportKeyword());
  // const functions = source.getFunctions().filter((f) => f.hasExportKeyword());
  // const types = source.getTypeAliases().filter((f) => f.isExported());

  // const count =
  //   assignments.length + variables.length + functions.length + exp.length + types.length;

  return {defaultExport, assignments, variables};
}
