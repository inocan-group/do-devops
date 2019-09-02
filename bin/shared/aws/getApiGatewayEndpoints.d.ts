import { APIGateway } from "aws-sdk";
/**
 * Gets all API Gatway _endpoints_ defined in a given
 * AWS profile/account.
 */
export declare function getApiGatewayEndpoints(profileName: string, region: string): Promise<import("aws-sdk").Request<APIGateway.RestApi, import("aws-sdk").AWSError>>;
