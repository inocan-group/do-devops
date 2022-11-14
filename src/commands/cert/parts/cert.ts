import chalk from "chalk";
import { exit } from "node:process";
import { DoDevopsHandler, Options } from "src/@types";
import { certInfo, createCA, createCertificate, createSSH } from "./crypto";
import { ICertOptions } from "./options";

export const handler: DoDevopsHandler<Options<ICertOptions>> = async ({ opts, subCommand }) => {
  if (!subCommand) {
    console.log(
      `{red - no {bold cert} sub-command found;} valid options are:\n    - {green ca} or {green ssl} for SSL certs\n    - {green ssh} to create an SSH key pair, and\n    - {green info} for information on a particular certificate\n\n- type {blue dd cert --help} for more info`
    );
    exit(1);
  }

  const o: ICertOptions = {
    days: 3650,
    csr_algo: "sha256",
    ssl_algo: "aes256",
    ssh_algo: opts.github ? "ed25519" : "rsa",
    ...opts,
    local_domain: opts.local_domain ? opts.local_domain?.replace(/^\.(.*)/, "$1") : "local",
  };
  o.name = subCommand === "ca" ? o.name || "ca" : o.name || undefined;
  o.keyLength =
    subCommand === "ssh"
      ? o.keyLength || o.ssh_algo === "rsa"
        ? 4096
        : o.ssh_algo === "dsa"
        ? 512
        : undefined
      : o.keyLength || 4096;

  const dimQuote = chalk.dim("\"");

  switch (subCommand.toLowerCase()) {
    case "ca": {
      console.error(`- creating a {italic local} {green CA Certificate} pairing`);
      await createCA(o);
      break;
    }
    case "cert":
    case "certificate":
    case "ssl": {
      console.error(`- creating a local {green SSL Certificate} pairing`);
      await createCertificate(o);
      break;
    }
    case "ssh": {
      await createSSH(o);
      break;
    }
    case "info": {
      await certInfo(o);
      break;
    }
    default: {
      console.error(`{red - unknown sub command ${dimQuote}${chalk.bold(subCommand)}${dimQuote} }`);
      exit(1);
    }
  }

  exit(0);
};
