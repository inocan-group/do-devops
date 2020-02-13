import { IDictionary } from "common-types";
import { getApiGatewayEndpoints } from "../shared/aws/getApiGatewayEndpoints";
import { OptionDefinition } from "command-line-usage";
import chalk from "chalk";
import {
  determineProfile,
  getLambdaFunctions,
  determineRegion
} from "../shared";

export const description =
  "Lists out all the endpoints defined in a given AWS profile/account.";

export const options: OptionDefinition[] = [
  {
    name: "profile",
    type: String,
    typeLabel: "<profileName>",
    group: "endpoints",
    description: `set the AWS profile explicitly`
  }
];

export async function handler(args: string[], opts: IDictionary) {
  const profileName = await determineProfile({ cliOptions: opts });
  const region = await determineRegion({ cliOptions: opts });
  try {
    console.log(
      chalk`- getting API {italic endpoints} for the profile {bold ${profileName}} [ ${region} ]`
    );
    // const endpoints = await getLambdaFunctions(opts);
    const endpoints = await getApiGatewayEndpoints(profileName, region);
    console.log(JSON.stringify(endpoints, null, 2));
    
  } catch (e) {}
}
