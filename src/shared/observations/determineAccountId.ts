import { isAwsAccountId } from "common-types";
import { DoDevopObservation, IAwsOptions, Options } from "~/@types";
import { DevopsError } from "~/errors";

import { getAwsAccountId } from "../aws";
import { getProjectConfig, saveProjectConfig } from "../config";
import { askInputQuestion } from "../interactive";

export async function determineAccountId(
  opts: Options<IAwsOptions>,
  _observations: Set<DoDevopObservation>
) {
  // const log = logger(opts);
  const config = getProjectConfig();

  if (config.aws?.defaultAccountId) {
    return config.aws.defaultAccountId;
  }
  if (opts.profile) {
    const accountId = await getAwsAccountId(opts.profile);
    saveProjectConfig({ aws: { defaultAccountId: accountId } });
    return accountId;
  }

  if (opts.interactive) {
    const accountId = await askInputQuestion("What is your AWS account ID?");
    if (isAwsAccountId(accountId)) {
      saveProjectConfig({ aws: { defaultAccountId: accountId } });
      return accountId;
    }
    throw new DevopsError(
      `"${accountId}" does not appear to be a valid account ID. Please log into the AWS console and validate your ID.`,
      "invalid/account-id"
    );
  }

  return false;
}
