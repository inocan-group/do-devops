import { readFileSync } from "node:fs";

export const dnsAppearsInExtFile = (dns: string) => {
  const data = readFileSync("extfile.cnf", "utf8");
  return data.includes(dns) ? true : false;
};
