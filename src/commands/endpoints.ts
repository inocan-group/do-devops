import { IDictionary } from "common-types";
import { getApiGatewayEndpoints } from "../shared/aws/getApiGatewayEndpoints";

export const description =
  "Lists out all the endpoints defined in a given AWS profile/account.";

export async function handler(args: string[], opts: IDictionary) {
  try {
    const endpoints = await getApiGatewayEndpoints({
      cliOptions: opts,
      interactive: true
    });
  } catch (e) {}
}
