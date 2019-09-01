import { IServerlessAccountInfo } from "../../../bin/src/@types/general";
/**
 * Gets the `accountInfo` from the `serverless.yml` file if
 * possible. If not it returns nothing.
 */
export declare function getAccountInfoFromServerlessYaml(): Promise<IServerlessAccountInfo>;
