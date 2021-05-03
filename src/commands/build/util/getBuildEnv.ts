import { DoDevopObservation, IGlobalOptions } from "~/@types";
import {
  determineAccountId,
  determinePartition,
  determineProfile,
  determineRegion,
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
  const profile = await determineProfile({ ...opts, interactive: true }, observations);
  

  return {
    AWS_PARTITION: await determinePartition({ ...opts, interactive: true }, observations),
    AWS_PROFILE: ,
    AWS_REGION: await determineRegion({ ...opts, interactive: true }, observations),
    AWS_STAGE: await determineStage({ ...opts, interactive: true }, observations),
    AWS_ACCOUNT_ID: await determineAccountId({ ...opts, interactive: true }, observations),
  };
}
