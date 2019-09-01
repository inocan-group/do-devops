import { Lambda } from "aws-sdk";
import { determineRegion } from "./determineRegion";
import { IDictionary } from "common-types";
import { getAwsProfile } from "../aws";
import { getAwsProfileFromServerless } from ".";

export async function getLambdaFunctions(opts: IDictionary = {}) {
  const region = await determineRegion(opts);
  const profileName = await getAwsProfileFromServerless();
  const profile = await getAwsProfile(profileName);
  const lambda = new Lambda({
    apiVersion: "2015-03-31",
    region,
    secretAccessKey: profile.aws_secret_access_key,
    accessKeyId: profile.aws_access_key_id
  });

  const fns = await lambda.listFunctions().promise();
  return fns.Functions;
}
