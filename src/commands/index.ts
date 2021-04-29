// #autoindex:default

// #region autoindexed files

// index last changed at: 4th Apr, 2021, 06:33 PM ( GMT-7 )
// export: default; exclusions: index, private.
// files: watch.
// directories: autoindex, awsid, build, deploy, endpoints, fns, info, install, invoke, latest, layers, outdated, pkg, ssm, test, why.

// local file exports
export {  default as watch } from "./watch";

// directory exports
export * from "./autoindex/index";
export * from "./awsid/index";
export * from "./build/index";
export * from "./deploy/index";
export * from "./endpoints/index";
export * from "./fns/index";
export * from "./info/index";
export * from "./install/index";
export * from "./invoke/index";
export * from "./latest/index";
export * from "./layers/index";
export * from "./outdated/index";
export * from "./pkg/index";
export * from "./ssm/index";
export * from "./test/index";
export * from "./why/index";

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
