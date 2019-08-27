import { Lambda } from "aws-sdk";
import { getRegion } from "./getRegion";
import { IDictionary } from "common-types";
import { getDefaultAwsProfile, getAwsProfile } from "../aws";
import { getAwsProfileFromServerless } from ".";

export async function getLambdaFunctions(opts: IDictionary = {}) {
  const region = await getRegion(opts);
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
