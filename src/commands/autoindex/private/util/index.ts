// #autoindex:named
// #region autoindexed files

// index last changed at: 10th Oct, 2020, 08:50 AM ( GMT-7 )
// export: named; exclusions: index, private.
// files: alreadyHasAutoindexBlock, askHowToHandleMonoRepoIndexing, cleanOldBlockFormat, communicateApi, createMetaInfo, detectExportType, exportsHaveChanged, getExistingMetaInfo, isAutoindexFile, noDifference, nonBlockContent, removeExtension, replaceRegion, structurePriorAutoindexContent, timestamp, unexpectedContent.

// local file exports
export * from "./alreadyHasAutoindexBlock";
export * from "./askHowToHandleMonoRepoIndexing";
export * from "./cleanOldBlockFormat";
export * from "./communicateApi";
export * from "./createMetaInfo";
export * from "./detectExportType";
export * from "./exportsHaveChanged";
export * from "./getExistingMetaInfo";
export * from "./isAutoindexFile";
export * from "./noDifference";
export * from "./nonBlockContent";
export * from "./removeExtension";
export * from "./replaceRegion";
export * from "./structurePriorAutoindexContent";
export * from "./timestamp";
export * from "./unexpectedContent";

// Note:
// -----
// This file was created by running: "do devops autoindex"; it assumes you have
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
