import chalk from "chalk";

import {
  DevopsError,
  consoleDimensions,
  determineProfile,
  getAwsProfile,
  determineRegion,
} from "../../../../shared";
import { fromBase64 } from "native-dash";

import { SSM } from "aws-ssm";
import { format } from "date-fns";
import { table } from "table";
import { ISsmOptions } from "../../public/ssm-types";

export async function execute(argv: string[], options: ISsmOptions) {
  const profile = await determineProfile({ cliOptions: options, interactive: true });
  const profileInfo = await getAwsProfile(profile);
  const region: string =
    options.region ||
    profileInfo.region ||
    (await determineRegion({ cliOptions: options, interactive: true }));
  const secrets: string[] = argv;
  const nonStandardPath: boolean = options.nonStandardPath;
  const { width } = await consoleDimensions();

  if (!region) {
    throw new DevopsError(
      `Getting SSM secrets requires an ${chalk.bold(
        "AWS Region"
      )} and none could be deduced. You can explicitly state this by adding "--region XYZ" to the command.`
    );
  }

  if (!profile) {
    throw new DevopsError(
      `Getting SSM secrets requires an ${chalk.bold(
        "AWS Profile"
      )} and none could be deduced. You can explicitly state this by adding "--profile XYZ" to the command.`
    );
  }

  if (!options.quiet) {
    console.log(
      `- Getting SSM details for: ${chalk.italic.grey.bold(secrets.join(", "))}\n`
    );
  }

  const tableConfig = {
    columns: {
      0: { width: 30, alignment: "left" },
      1: { width: width > 125 ? 60 : width > 100 ? 40 : 35 },
      2: { width: 8, alignment: "center" },
      3: { width: 16, alignment: "center" },
    },
  };
  const ssm = new SSM({ profile, region });

  for await (const secret of secrets) {
    let tableData = [
      [
        chalk.yellow.bold("Path"),
        chalk.yellow.bold("ARN"),
        chalk.yellow.bold("Version"),
        chalk.yellow.bold("LastUpdated"),
      ],
    ];
    const data = await ssm.get(secret, { decrypt: true, nonStandardPath });
    tableData.push([
      data.path,
      data.arn,
      String(data.version),
      format(data.lastUpdated, "dd MMM, yyyy"),
    ]);
    const value = options.base64 ? fromBase64(String(data.value)) : String(data.value);
    if (!options.quiet) {
      console.log(table(tableData, tableConfig as any));
      console.log(chalk.yellow.bold("VALUE:\n"));
      console.log(value);
      console.log();
    } else {
      console.log(value);
    }
  }

  // let content;
  // if (width > 130) {
  //   content = table(tableData, tableConfig as any);
  // } else if (width > 115) {
  //   delete tableConfig.columns["3"];
  //   content = table(tableData.map(i => i.slice(0, 3)), tableConfig as any);
  // } else {
  //   delete tableConfig.columns["2"];
  //   delete tableConfig.columns["3"];
  //   content = table(tableData.map(i => i.slice(0, 2)), tableConfig as any);
  // }
  // console.log(content);
}
