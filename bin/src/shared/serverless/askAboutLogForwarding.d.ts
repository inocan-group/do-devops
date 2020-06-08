import { IServerlessConfig } from "common-types";
/**
 * Checks whether the existing configuration has `logForwarding`
 * turned on in the **custom** section. If it _does_ then it just
 * logs a message about that, if it doesn't then it drops into
 * interactive mode if the `serverless-log-forwarding` is installed
 * as a **devDep**.
 */
export declare function askAboutLogForwarding(config: IServerlessConfig): Promise<IServerlessConfig<import("common-types").IServerlessConfigCustom>>;
