import { execSync } from "node:child_process";

export const nslookup = (dnsName: string) => {
  try {
    const results = execSync(`nslookup ${dnsName}`, { encoding: "utf8" });

    const ipAddress = results
      .split("\n")
      .filter((i) => i.includes("Address:"))
      .pop()
      ?.replace(/Address: /, "");

    return ipAddress;
  } catch {
    return;
  }
};
