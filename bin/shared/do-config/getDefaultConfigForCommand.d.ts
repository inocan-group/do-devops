import * as defaults from "../../commands/defaults";
export declare type IDoConfigSections = keyof typeof defaults;
/**
 * **getDefaultConfig**
 *
 * Returns the _default config_ for a given command. If you want to
 * get the "global" defaults just use `global` as the _command_.
 */
export declare function getDefaultConfig(command?: IDoConfigSections): any;
