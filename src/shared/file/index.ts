// #autoindex:named, exclude: helpers

// #region autoindexed files

// index last changed at: 5th May, 2021, 04:22 PM ( GMT-7 )
// export: named; exclusions: helpers, index, private.
// files: createTsFile, directoryFiles, filepathParts, filesInfo, getAllFilesOfType, getDataFiles, getExportsFromFile, getFileFromHomeDirectory, getMonoRepoPackages, lintfix, readDataFile, relativePath, saveFileToHomeDirectory, saveYamlFile, stripFileExtension, symlinks.
// directories: base-paths, crud, existance.

// local file exports
export * from "./createTsFile";
export * from "./directoryFiles";
export * from "./filepathParts";
export * from "./filesInfo";
export * from "./getAllFilesOfType";
export * from "./getDataFiles";
export * from "./getExportsFromFile";
export * from "./getFileFromHomeDirectory";
export * from "./getMonoRepoPackages";
export * from "./lintfix";
export * from "./readDataFile";
export * from "./relativePath";
export * from "./saveFileToHomeDirectory";
export * from "./saveYamlFile";
export * from "./stripFileExtension";
export * from "./symlinks";

// directory exports
export * from "./base-paths/index";
export * from "./crud/index";
export * from "./existance/index";

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
