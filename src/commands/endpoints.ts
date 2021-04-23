import chalk from "chalk";

import { getApiGatewayEndpoints } from "~/shared/aws";
import { determineProfile, determineRegion } from "~/shared/observations";
import { IOptionDefinition } from "~/@types/option-types";
import { ICommandInput } from "~/@types/command";

export const description =
  "Lists out all the endpoints defined in a given AWS profile/account.";

export const options: IOptionDefinition = {
  profile: {
    type: String,
    typeLabel: "<profileName>",
    group: "local",
    description: "set the AWS profile explicitly",
  },
};

export async function handler(input: ICommandInput<{ profile: string }>) {
  const { opts } = input;
  const profileName = await determineProfile({ cliOptions: opts });
  const region = await determineRegion({ cliOptions: opts });
  try {
    console.log(
      chalk`- getting API {italic endpoints} for the profile {bold ${profileName}} [ ${region} ]`
    );
    // const endpoints = await getLambdaFunctions(opts);
    const endpoints = await getApiGatewayEndpoints(profileName, region);
    console.log(JSON.stringify(endpoints, null, 2));
  } catch {}
}
