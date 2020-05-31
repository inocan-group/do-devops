import { IDictionary } from "common-types";

export function description() {
  return `Provides an easy way to access a particular (or all) AWS account ID's defined in the user's credentials file (~/.aws/credentials).`;
}
export const signature = "<aws-profile-name>";
export const examples = [
  {
    name: "Interactive",
    desc: "no parameters leads to an interactive session to determine profile",
    example: "do aws-account",
  },
  {
    name: "Specific",
    desc: "when you state a profile name it will return that profile",
    example: "do aws-account my-service",
  },
  {
    name: "All",
    desc: "the '--all' modifier will list all known profiles and their Account IDs",
    example: "do aws-account --all",
  },
];

export async function handler(argv: string[], opts: IDictionary): Promise<void> {
  //
}
