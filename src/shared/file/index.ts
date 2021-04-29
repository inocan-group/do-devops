// #autoindex:named

// #region autoindexed files

// index last changed at: 4th Apr, 2021, 11:30 AM ( GMT-7 )
// export: named; exclusions: index, private.
// files: directoryFiles, ensureDirectory, filesExist, filesInfo, getAllFilesOfType, getDataFiles, getExportsFromFile, getFileFromHomeDirectory, getMonoRepoPackages, interpolateFilepath, libraryDirectory, readDataFile, readFile, relativePath, saveFileToHomeDirectory, saveYamlFile, stripFileExtension, write.

// local file exports
export * from "./directoryFiles";
export * from "./ensureDirectory";
export * from "./filesExist";
export * from "./filesInfo";
export * from "./getAllFilesOfType";
export * from "./getDataFiles";
export * from "./getExportsFromFile";
export * from "./getFileFromHomeDirectory";
export * from "./getMonoRepoPackages";
export * from "./interpolateFilepath";
export * from "./libraryDirectory";
export * from "./readDataFile";
export * from "./readFile";
export * from "./relativePath";
export * from "./saveFileToHomeDirectory";
export * from "./saveYamlFile";
export * from "./stripFileExtension";
export * from "./write";

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
