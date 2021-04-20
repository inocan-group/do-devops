// #autoindex:named

// #region autoindexed files

// index last changed at: 4th Apr, 2021, 02:55 PM ( GMT-7 )
// export: named; exclusions: index, private.
// files: askForDataFile, consoleDimensions, defaultConfigSections, ensureDirectory, getCommandInterface, getDataFiles, getExportsFromFile, inverted, options, readDataFile, readFile, runHooks, sandbox.
// directories: ast, aws, commands, do-config, file, git, interactive, npm, observations, serverless, sound, ui, yeoman.

// local file exports
export * from "./askForDataFile";
export * from "./consoleDimensions";
export * from "./defaultConfigSections";
export * from "./ensureDirectory";
export * from "./getCommandInterface";
export * from "./getDataFiles";
export * from "./getExportsFromFile";
export * from "./inverted";
export * from "./options";
export * from "./readDataFile";
export * from "./readFile";
export * from "./runHooks";
export * from "./sandbox";

// directory exports
export * from "./ast/index";
export * from "./aws/index";
export * from "./commands/index";
export * from "./do-config/index";
export * from "./file/index";
export * from "./git/index";
export * from "./interactive/index";
export * from "./npm/index";
export * from "./observations/index";
export * from "./serverless/index";
export * from "./sound/index";
export * from "./ui/index";
export * from "./yeoman/index";

// Note:
// -----
// This file was created by running: "dd devops autoindex"; it assumes you have
// the 'do-devops' pkg installed as a dev dep.
//
// By default it assumes that exports are named exports but this can be changed by
// adding a modifier to the '// #autoindex' syntax:
//
//    - autoindex:named     same as default, exports "named symbols"
//    - autoindex:default   assumes each file is exporting a default export
//                          and converts the default export to the name of the
//                          file
//    - autoindex:offset    assumes files export "named symbols" but that each
//                          file's symbols should be offset by the file's name
//                          (useful for files which might symbols which collide
//                          or where the namespacing helps consumers)
//
// You may also exclude certain files or directories by adding it to the
// autoindex command. As an example:
//
//    - autoindex:named, exclude: foo,bar,baz
//
// Also be aware that all of your content outside the defined region in this file
// will be preserved in situations where you need to do something paricularly awesome.
// Keep on being awesome.

// #endregion
