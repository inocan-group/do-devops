// #autoindex:named, exclude: recursiveNamed

// #region autoindexed files
// index last changed at: 7th Jul, 2022, 06:39 PM ( GMT-7 )
// hash-code: 80ba9019

// directory exports
export * from "./fooNamed/index";

// #endregion

// This file was created by running: "dd autoindex"; it assumes you have
// the 'do-devops' pkg (that's "dd" on npm) installed as a dev dep.
//
// By default it assumes that exports are named exports but this can be changed by
// adding a modifier to the '// #autoindex' syntax:
//
//    - autoindex:named     same as default, exports "named symbols"
//    - autoindex:default   assumes each file is exporting a default export and
//                          converts the default export to the name of the file
//    - autoindex:offset    assumes files export "named symbols" but that each
//                          file's symbols should be offset by the file's name
//
// You may also exclude certain files or directories by adding it to the
// autoindex command. As an example:
//
//    - autoindex:named, exclude: foo,bar,baz
//
// Inversely, if you state a file to be an "orphan" then autoindex files
// below this file will not reference this autoindex file:
//
//    - autoindex:named, orphan
// 
// All content outside the "// #region" section in this file will be
// preserved in situations where you need to do something paricularly awesome.
// Keep on being awesome.
