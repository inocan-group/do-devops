import chalk from "chalk";
import * as process from "process";

import { SSM } from "aws-ssm";
import { format } from "date-fns";
import { table } from "table";
import { getAwsProfile } from "~/shared/aws";
import { determineProfile, determineRegion } from "~/shared/observations";
import { ISsmOptions } from "../../parts";
import { IGlobalOptions } from "~/shared";

export async function execute(argv: string[], options: ISsmOptions & IGlobalOptions) {
  const profile = await determineProfile({ ...options, interactive: true });
  const profileInfo = await getAwsProfile(profile);
  const region =
    options.region ||
    profileInfo.region ||
    (await determineRegion({ ...options, interactive: true }));
  const filterBy = argv.length > 0 ? argv[0] : undefined;

  if (!profile || !region) {
    console.log(chalk`{red - missing information!}`);
    console.log(
      chalk`To list SSM params the AWS {italic profile} and {italic region} must be stated. These could {bold not} be determined so exiting.`
    );
    console.log(
      chalk`{dim note that the easiest way to get an explicit profile/region is to use the {bold --profile} and {bold --region} switches on the command line.}\n`
    );

    process.exit();
  }

  if (!options.quiet) {
    console.log(
      `- Listing SSM parameters in profile "${chalk.bold(profile)}", region "${chalk.bold(
        region
      )}"${
        filterBy
          ? `; results reduced to those with "${chalk.bold(filterBy)}" in the name.`
          : ""
      }`
    );
    console.log();
  }

  const ssm = new SSM({
    profile,
    region,
  });

  const list = await ssm.describeParameters();

  const tableData = [
    [
      chalk.bold("Name"),
      chalk.bold("Version"),
      chalk.bold("Type"),
      chalk.bold("LastModified"),
      chalk.bold("User"),
    ],
  ];

  for (const i of list.filter((i) => !filterBy || (i.Name || "").includes(filterBy))) {
    tableData.push([
      i.Name || "",
      String(i.Version),
      i.Type || "",
      i.LastModifiedDate ? format(i.LastModifiedDate, "dd MMM, yyyy") : "",
      i.LastModifiedUser ? i.LastModifiedUser.replace(/.*user\//, "") : "",
    ]);
  }
  const tableConfig = {
    columns: {
      0: { width: 42, alignment: "left" },
      1: { width: 8, alignment: "center" },
      2: { width: 14, alignment: "center" },
      3: { width: 18, alignment: "center" },
      4: { width: 14 },
    },
  };
  console.log(table(tableData, tableConfig as any));
}
