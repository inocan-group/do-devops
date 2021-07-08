// #autoindex:default

// #region autoindexed files

// index last changed at: 7th Jul, 2021, 07:00 AM ( GMT-7 )
// export: default; exclusions: index, private.
// files: add, install, ls, upgrade, watch.
// directories: autoindex, awsid, build, deploy, endpoints, fns, image, info, invoke, latest, layers, madge, outdated, pkg, scaffold, ssm, test, upgrade, why.

// local file exports
export { default as add } from "./add";
export { default as install } from "./install";
export { default as ls } from "./ls";
export { default as upgrade } from "./upgrade";
export { default as watch } from "./watch";

// directory exports
export { default as autoindex } from "./autoindex/index";
export { default as awsid } from "./awsid/index";
export { default as build } from "./build/index";
export { default as deploy } from "./deploy/index";
export { default as endpoints } from "./endpoints/index";
export { default as fns } from "./fns/index";
export { default as image } from "./image/index";
export { default as info } from "./info/index";
export { default as invoke } from "./invoke/index";
export { default as latest } from "./latest/index";
export { default as layers } from "./layers/index";
export { default as madge } from "./madge/index";
export { default as outdated } from "./outdated/index";
export { default as pkg } from "./pkg/index";
export { default as scaffold } from "./scaffold/index";
export { default as ssm } from "./ssm/index";
export { default as test } from "./test/index";
export { default as upgrade } from "./upgrade/index";
export { default as why } from "./why/index";

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
