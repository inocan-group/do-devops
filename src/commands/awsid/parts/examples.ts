export const examples = [
  {
    name: "Interactive",
    desc: "no parameters leads to an interactive session to determine profile",
    example: "dd aws-account",
  },
  {
    name: "Specific",
    desc: "when you state a profile name it will return that profile",
    example: "dd aws-account my-service",
  },
  {
    name: "All",
    desc: "the '--all' modifier will list all known profiles and their Account IDs",
    example: "dd aws-account --all",
  },
];
