//#autoindex:named

// #region autoindexed files
// index last changed at: 1st Jan, 2022, 03:09 PM ( GMT-8 )
// hash-code: b3de5fec

// file exports
export * from "./askAboutLogForwarding";
export * from "./askForFunction";
export * from "./askForStage";
export * from "./findAllHandlerFiles";
export * from "./findConfigFunctionDefnFiles";
export * from "./findInlineFunctionDefnFiles";
export * from "./getAccountInfoFromServerlessYaml";
export * from "./getAwsProfileFromServerless";
export * from "./getLambdaFunctions";
export * from "./getLocalHandlerInfo";
export * from "./getLocalServerlessFunctionsFromServerlessYaml";
export * from "./getMicroserviceConfig";
export * from "./getServerlessBuildConfiguration";
export * from "./getServerlessYaml";
export * from "./sandbox";
export * from "./saveToServerlessYaml";
export * from "./serverlessYamlExists";
// directory exports
export * from "./accountInfo/index";
export * from "./build/index";
export * from "./functions/index";
export * from "./layers/index";
export * from "./webpack/index";

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
