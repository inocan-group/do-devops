/* eslint-disable unicorn/import-style */
import { getApiGatewayEndpoints } from "~/shared/aws";
import { determineProfile, determineRegion } from "~/shared/observations";
import { DoDevopsHandler } from "~/@types/command";
import { IEndpointsOptions } from "./options";
import { table } from "table";
import chalk, { inverse } from "chalk";

export const handler: DoDevopsHandler<IEndpointsOptions> = async ({ opts }) => {
  const profileName = opts.profile ? opts.profile : await determineProfile(opts);
  if (!profileName) {
    console.log(
      `- couldn't determine the AWS profile to use; try setting it manually with ${inverse(
        " --profile "
      )} option or switch to interactive mode with ${inverse(" --interactive ")}\n`
    );
    process.exit(1);
  }
  const region = opts.region ? opts.region : await determineRegion(opts);
  try {
    console.log(
      chalk`- getting API {italic endpoints} for the profile {bold  ${profileName}} [ ${region} ]`
    );
    // const endpoints = await getLambdaFunctions(opts);
    if (region) {
      const response = await getApiGatewayEndpoints(profileName, region);
      const restApi = response.restApi?.items
        ? response.restApi.items.map((i) => {
            return [i.id, i.name || "", i.description || ""];
          })
        : [];
      const httpApi = response.httpApi?.Items
        ? response.httpApi.Items.map((i) => {
            return [
              i.ApiId || "",
              i.Name || "",
              i.ApiEndpoint || "",
              i.CorsConfiguration?.AllowMethods?.join(", ") || "None",
              i.CorsConfiguration?.AllowOrigins?.join(", ") || "unknown",
            ];
          })
        : [];
      if (restApi.length > 0) {
        console.log("\nREST API Endpoints");
        console.log(table([...[["id", "name", "description"]], ...restApi]));
        console.log();
      } else {
        console.log(chalk`{gray - no REST API endpoints found}`);
        console.log();
      }

      if (httpApi.length > 0) {
        console.log("HTTP API Endpoints");
        const t = [...[["id", "name", "endpoint", "methods", "origins"]], ...httpApi];
        console.log(table(t));
      }
    } else {
      console.log(
        chalk`- could not determine {bold {yellow AWS region}}; try using "--region" option to set it explicitly\n`
      );
    }
  } catch {}
};
