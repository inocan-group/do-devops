import { ApiGatewayV2, APIGateway } from "aws-sdk";
import { getAwsProfile, convertProfileToApiCredential } from "./index";

/**
 * Gets all API Gatway _endpoints_ defined in a given
 * AWS profile/account.
 */
export async function getApiGatewayEndpoints(
  profileName: string,
  region?: string
) {
  const profile = convertProfileToApiCredential(
    await getAwsProfile(profileName)
  );

  // return new Promise((resolve, reject) => {
  //   const gw = new APIGateway({
  //     ...profile
  //   });
  //   console.log("calling");

  //   gw.getRestApis((err, data) => {
  //     if (data) {
  //       reject(err);
  //     } else {
  //       resolve(data.items);
  //     }
  //   });
  // });

  // v2
  // const gw = new ApiGatewayV2({
  //   apiVersion: "2018-11-29",
  //   ...profile
  // });

  // const routes = await gw.getRoutes().promise();
  // return routes.Items;
  // const result = await gw.getApis().promise();
  // return result.Items;

  const gw = new APIGateway({
    ...profile
  });

  const apis = await gw.getRestApis().promise();
  return apis.items;
}
