import { CommandLineOptions } from "command-line-args";
import { SSM } from "aws-ssm";
import chalk from "chalk";
import { format } from "date-fns";
import { table } from "table";
import { DevopsError, consoleDimensions } from "../../shared";

export async function execute(options: CommandLineOptions) {
  const profile: string = options.ssm.profile;
  const region: string = options.ssm.region;
  const secrets: string[] = options["_unknown"];
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

  console.log(
    `- Getting SSM details for: ${chalk.italic.grey.bold(secrets.join(", "))}\n`
  );
  let tableData = [
    [
      chalk.bold("Path"),
      chalk.bold("Value"),
      chalk.bold("Version"),
      chalk.bold("LastUpdated")
    ]
  ];
  const ssm = new SSM({ profile, region });
  for await (const secret of secrets) {
    const data = await ssm.get(secret, { decrypt: true });
    tableData.push([
      data.path,
      String(data.value),
      String(data.version),
      format(data.lastUpdated, "DD MMM, YYYY")
    ]);
  }
  const tableConfig = {
    columns: {
      0: { width: 30, alignment: "left" },
      1: { width: 60 },
      2: { width: 8, alignment: "center" },
      3: { width: 16, alignment: "center" }
    }
  };
  let content;
  if (width > 130) {
    content = table(tableData, tableConfig as any);
  } else if (width > 115) {
    delete tableConfig.columns["3"];
    content = table(tableData.map(i => i.slice(0, 3)), tableConfig as any);
  } else {
    delete tableConfig.columns["2"];
    delete tableConfig.columns["3"];
    content = table(tableData.map(i => i.slice(0, 2)), tableConfig as any);
  }
  console.log(content);
}
