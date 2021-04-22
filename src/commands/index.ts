// #autoindex:named-offset, exclude:  build-helpers, deploy-helpers

// #region autoindexed files

// index last changed at: 4th Apr, 2021, 07:00 AM ( GMT-7 )
// export: namedOffset; exclusions: build-helpers, deploy-helpers, index, private.
// files: deploy, endpoints, fns, global, help, info, invoke, pkg.
// directories: autoindex, awsid, build, latest, layers, ssm, test, validate.

// local file exports
export * as deploy from "./deploy";
export * as endpoints from "./endpoints";
export * as fns from "./fns";
export * as global from "./global";
export * as help from "./help";
export * as info from "./info";
export * as invoke from "./invoke";
export * as pkg from "./pkg";

// directory exports
export * as autoindex from "./autoindex/index";
export * as awsid from "./awsid/index";
export * as build from "./build/index";
export * as latest from "./latest/index";
export * as layers from "./layers/index";
export * as ssm from "./ssm/index";
export * as test from "./test/index";
export * as validate from "./validate/index";

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
