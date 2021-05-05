import { DoDevopObservation, IGlobalOptions } from "~/@types";
import { DevopsError } from "~/errors";
import { getAwsProfile } from "~/shared";
import {
  determineAccountId,
  determinePartition,
  determineProfile,
  determineRegion,
  determineStackName,
  determineStage,
} from "~/shared/observations";
import { IBuildOptions } from "../parts";

/**
 * Creates a dictionary of available environment variables which includes
 * at a bare minimum: stage, region, profile, stack/app-name, partition, and account id.
 */
export async function getBuildEnvironment(
  opts: IGlobalOptions<IBuildOptions>,
  observations: Set<DoDevopObservation>
) {
  const profileName = await determineProfile({ ...opts, interactive: true }, observations);
  if (!profileName) {
    throw new DevopsError(
      `Can not continue without knowing the AWS profile to use!`,
      "not-ready/no-profile"
    );
  }
  const profile = await getAwsProfile(profileName);

  return {
    AWS_PROFILE: profileName,
    AWS_PARTITION: await determinePartition({ ...opts, interactive: true }, observations),
    AWS_REGION: await determineRegion(
      { ...opts, ...(profile.region ? { region: profile.region } : {}), interactive: true },
      observations
    ),
    AWS_STAGE: await determineStage({ ...opts, interactive: true }, observations),
    AWS_ACCOUNT_ID: await determineAccountId(
      { ...opts, profile: profileName, interactive: true },
      observations
    ),
    STACK_NAME: await determineStackName({ ...opts, interactive: true }, observations),
  };
}
