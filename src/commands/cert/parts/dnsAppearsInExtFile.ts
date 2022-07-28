import chalk from "chalk";
import { readFileSync } from "node:fs";
import { find } from "native-dash";
import { emoji } from "src/shared/ui";
import { askListQuestion } from "src/shared/interactive";

export type ExtFileResolutions = "no-conflict" | "overwrite" | "skip" | "quit";

export const avoidDuplicationInExtFile = async (
  dns: string,
  ipAddress: string
): Promise<ExtFileResolutions> => {
  const data = readFileSync("extfile.cnf", "utf8");
  const locate = find(`.*DNS:${dns},IP:(.*)`, "ip");
  const { ip, found, next } = locate(data);
  const { ip: nextIp, found: nextFound } = next ? next() : { ip: undefined, found: false };

  if (found) {
    console.error(
      chalk`- it appears that a DNS entry of {bold {green ${dns}}} (with IP of {green ${ip}}) already exists in your "extfile.cnf" file.`
    );
    if (ipAddress.trim() === ip.trim()) {
      console.error(
        chalk`- using {blue nslookup} we see that the IP address does match that DNS entry ${emoji.thumbsUp}`
      );
    } else if (ipAddress.trim() === "") {
      console.error(
        chalk`- using {blue nslookup} was of no use as {green ${dns}} didn't produce any results ${emoji.poop}`
      );
    } else {
      console.error(
        chalk`- using {blue nslookup} came back with an IP address of ${ipAddress}, which in case you weren't paying attention doesn't match your file where the record is ${emoji.shocked}`
      );
    }

    if (nextFound) {
      console.error(
        chalk`- {red crikey mate}, you've got MORE than one entry for {green ${dns}}; the second reference points to ${nextIp}`
      );
    }

    const resolution = await askListQuestion(
      `What do you want to do?`,
      {
        overwrite: chalk`{bold overwrite} the entry for ${dns} to an IP of ${ipAddress}`,
        skip: chalk`{bold skip} modifying the file; i'm happy with where it's at`,
        quit: chalk`{bold quit} out of this process`,
      },
      { default: "skip" }
    );

    return resolution;
  } else {
    return "no-conflict";
  }
};
