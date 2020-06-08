import { IServerlessAccountInfo } from "../../@types";
/**
 * Gets the typescript configuration file for serverless
 * projects which use the `typescript-microservice` yeoman
 * template and generates a `serverless.yml` file from it.
 */
export declare function getMicroserviceConfig(accountInfo: IServerlessAccountInfo): Promise<string>;
