import { ApiGatewayV2 } from "aws-sdk";
/**
 * Gets all API Gatway _endpoints_ defined in a given
 * AWS profile/account.
 */
export declare function getApiGatewayEndpoints(opts?: {
    cliOptions?: {
        region?: string;
        profile?: string;
        stage?: string;
    };
    interactive?: boolean;
}): Promise<ApiGatewayV2.Api[]>;
