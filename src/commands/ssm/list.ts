import { CommandLineOptions } from "command-line-args";
import chalk from "chalk";
import { table } from "table";
import { format } from "date-fns";
import { SSM } from "aws-ssm";

export async function execute(options: CommandLineOptions) {
  const profile = options.ssm.profile;
  const region = options.ssm.region;
  const filterBy = options._unknown ? options._unknown.shift() : undefined;

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

  console.log(
    `- Listing SSM parameters in profile "${chalk.bold(
      profile
    )}", region "${chalk.bold(region)}"${
      filterBy
        ? `; results reduced to those with "${chalk.bold(
            filterBy
          )}" in the name.`
        : ""
    }`
  );
  console.log();

  const ssm = new SSM({ profile, region });
  const list = await ssm.describeParameters();

  let tableData = [
    [
      chalk.bold("Name"),
      chalk.bold("Version"),
      chalk.bold("Type"),
      chalk.bold("LastModified"),
      chalk.bold("User")
    ]
  ];

  list.forEach(i => {
    tableData.push([
      i.Name,
      String(i.Version),
      i.Type,
      format(i.LastModifiedDate, "DD MMM, YYYY"),
      i.LastModifiedUser.replace(/.*user\//, "")
    ]);
  });
  const tableConfig = {
    columns: {
      0: { width: 42, alignment: "left" },
      1: { width: 8, alignment: "center" },
      2: { width: 14, alignment: "center" },
      3: { width: 18, alignment: "center" },
      4: { width: 14 }
    }
  };
  console.log(table(tableData, tableConfig as any));
}
