import chalk from "chalk";

import { getApiGatewayEndpoints } from "~/shared/aws";
import { determineProfile, determineRegion } from "~/shared/observations";
import { DoDevopsHandler } from "~/@types/command";

export const handler: DoDevopsHandler<{ profile: string }> = async ({ opts }) => {
  const profileName = await determineProfile(opts);
  const region = await determineRegion(opts);
  try {
    console.log(
      chalk`- getting API {italic endpoints} for the profile {bold ${profileName}} [ ${region} ]`
    );
    // const endpoints = await getLambdaFunctions(opts);
    if (region) {
      const endpoints = await getApiGatewayEndpoints(profileName, region);
      console.log(JSON.stringify(endpoints, null, 2));
    } else {
      console.log(`- could not determine AWS region; try using "--region" option\n`);
    }
  } catch {}
};
