export const START_REGION = "// #region autoindexed files";
export const END_REGION = "// #endregion";

const comment = "//";
const noteIndent = `${comment} ${" ".repeat(0)}`;
const bulletLine = `${comment}${" ".repeat(4)}- `;
const bulletIndent = `${comment}${" ".repeat(20)}      `;

const info = [
  `${noteIndent}This file was created by running: "dd autoindex"; it assumes you have`,
  `${noteIndent}the 'do-devops' pkg (that's "dd" on npm) installed as a dev dep.`,
  `${comment}`,
  `${noteIndent}By default it assumes that exports are named exports but this can be changed by`,
  `${noteIndent}adding a modifier to the '// #autoindex' syntax:`,
  `${comment}`,
  `${bulletLine}autoindex:named     same as default, exports "named symbols"`,
  `${bulletLine}autoindex:default   assumes each file is exporting a default export and`,
  `${bulletIndent}converts the default export to the name of the file`,
  `${bulletLine}autoindex:offset    assumes files export "named symbols" but that each`,
  `${bulletIndent}file's symbols should be offset by the file's name`,
  `${comment}`,
  `${noteIndent}You may also exclude certain files or directories by adding it to the`,
  `${noteIndent}autoindex command. As an example:`,
  `${comment}`,
  `${bulletLine}autoindex:named, exclude: foo,bar,baz`,
  `${comment}`,
  `${noteIndent}Inversely, if you state a file to be an "orphan" then autoindex files`,
  `${noteIndent}below this file will not reference this autoindex file:`,
  `${comment}`,
  `${bulletLine}autoindex:named, orphan`,
  `${noteIndent}`,
  `${noteIndent}All content outside the "// #region" section in this file will be`,
  `${noteIndent}preserved in situations where you need to do something paricularly awesome.`,
  `${noteIndent}Keep on being awesome.`,
];

export const AUTOINDEX_INFO_MSG = info.join("\n");
export const NEW_AUTOINDEX_CONTENT = `// #autoindex\n`;
