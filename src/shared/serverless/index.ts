//#autoindex:named

// #region autoindexed files

// index last changed at: 4th Apr, 2021, 12:05 PM ( GMT-7 )
// export: named; exclusions: index, private.
// files: askAboutLogForwarding, askForFunction, askForStage, findAllHandlerFiles, findConfigFunctionDefnFiles, findInlineFunctionDefnFiles, getAccountInfoFromServerlessYaml, getAwsProfileFromServerless, getLambdaFunctions, getLocalHandlerInfo, getLocalServerlessFunctionsFromServerlessYaml, getMicroserviceConfig, getServerlessBuildConfiguration, getServerlessYaml, sandbox, saveToServerlessYaml, serverlessYamlExists.
// directories: accountInfo, build, functions, layers, webpack.

// local file exports
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
