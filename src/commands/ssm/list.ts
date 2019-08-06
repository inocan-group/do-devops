import { CommandLineOptions } from "command-line-args";
import chalk from "chalk";
import { asyncExec } from "async-shelljs";
import { table } from "table";
import { format } from "date-fns";

export async function execute(options: CommandLineOptions) {
  const profile = options.ssm.profile;
  const region = options.ssm.region;
  const filterBy = options._unknown ? options._unknown.shift() : undefined;

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

  const list: { Parameters: ISsmDescribeParameter[] } = JSON.parse(
    await asyncExec(
      `aws --profile ${profile} --region ${region} ssm describe-parameters`,
      { silent: true }
    )
  );

  let tableData = [
    [
      chalk.bold("Name"),
      chalk.bold("Version"),
      chalk.bold("Type"),
      chalk.bold("LastModified"),
      chalk.bold("User")
    ]
  ];
  list.Parameters.filter(i =>
    filterBy ? i.Name.toLowerCase().includes(filterBy.toLowerCase()) : true
  ).forEach(i => {
    tableData.push([
      i.Name,
      String(i.Version),
      i.Type,
      format(i.LastModifiedDate * 1000, "DD MMM, YYYY"),
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

interface ISsmDescribeParameter {
  Name: string;
  Version: number;
  LastModifiedDate: number;
  LastModifiedUser: string;
  Type: string;
}
