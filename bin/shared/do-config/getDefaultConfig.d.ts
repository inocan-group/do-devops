import { IDoConfig } from "../../@types";
/**
 * **getDefaultConfig**
 *
 * If the `command` is not specified it returns the default config file
 * with **all** sections filled in. If you want only a only a single
 * section then you can name it (where "global" is what it says on
 * the tin).
 */
export declare function getDefaultConfig(command?: keyof IDoConfig): IDoConfig | import("../../@types").IDoGlobalConfig | import("../../@types").IDoBuildConfig | import("../../@types").IDoPkgConfig;
export declare function getFullDefaultConfig(): IDoConfig;
