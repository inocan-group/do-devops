export const START_REGION = "//#region autoindexed files";
export const END_REGION = "//#endregion";

const comment = "//";
const noteIndent = `${comment} ${" ".repeat(0)}`;
const bulletLine = `${comment}${" ".repeat(4)}- `;
const bulletIndent = `${comment}${" ".repeat(20)}      `;

const info = [
  `${comment} Note:`,
  `${comment} -----`,
  `${noteIndent}This file was created by running: "do devops autoindex"; it assumes you have`,
  `${noteIndent}the 'do-devops' pkg installed as a dev dep.`,
  `${comment}`,
  `${noteIndent}By default it assumes that exports are named exports but this can be changed by`,
  `${noteIndent}adding a modifier to the '//#autoindex' syntax:`,
  `${comment}`,
  `${bulletLine}autoindex:named     same as default, exports "named symbols"`,
  `${bulletLine}autoindex:default   assumes each file is exporting a default export`,
  `${bulletIndent}and converts the default export to the name of the`,
  `${bulletIndent}file`,
  `${bulletLine}autoindex:offset    assumes files export "named symbols" but that each`,
  `${bulletIndent}file's symbols should be offset by the file's name`,
  `${bulletIndent}(useful for files which might symbols which collide`,
  `${bulletIndent}or where the namespacing helps consumers)`,
  `${comment}`,
  `${noteIndent}You may also exclude certain files or directories by adding it to the`,
  `${noteIndent}autoindex command. As an example:`,
  `${comment}`,
  `${bulletLine}autoindex:named, exclude: foo,bar,baz`,
  `${comment}`,
  `${noteIndent}Also be aware that all of your content outside the defined region in this file`,
  `${noteIndent}will be preserved in situations where you need to do something paricularly awesome.`,
  `${noteIndent}Keep on being awesome.`,
];

export const AUTOINDEX_INFO_MSG = info.join("\n");
