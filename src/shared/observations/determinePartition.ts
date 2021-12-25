import { AwsArnPartition } from "common-types";
import { DoDevopObservation, IAwsOptions, Options } from "~/@types";
import { getProjectConfig, saveProjectConfig } from "~/shared/config";
import { askListQuestion } from "~/shared/interactive";

export async function determinePartition(
  opts: Options<IAwsOptions>,
  _observations: Set<DoDevopObservation>
) {
  // const log = logger(opts);
  const config = getProjectConfig();

  if (config.aws?.defaultPartition) {
    return config.aws.defaultPartition;
  }

  if (opts.interactive) {
    const partition = await askListQuestion<AwsArnPartition>(
      "What AWS partition will this repo use? If you don't know just choose 'aws'",
      ["aws", "aws-us-gov", "aws-cn"],
      { default: "aws" }
    );
    saveProjectConfig({ aws: { defaultPartition: partition } });

    return partition;
  }

  return false;
}
