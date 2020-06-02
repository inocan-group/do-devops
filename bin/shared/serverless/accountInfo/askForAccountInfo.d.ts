import { IServerlessAccountInfo } from "common-types";
/**
 * Allows the properties not yet defined in the configuration to be
 * interactively added.
 *
 * @param config the configuration as it has been defined so far
 */
export declare function askForAccountInfo(config?: Partial<IServerlessAccountInfo>): Promise<IServerlessAccountInfo>;
