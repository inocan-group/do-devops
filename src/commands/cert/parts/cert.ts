import chalk from "chalk";
import { exit } from "node:process";
import { DoDevopsHandler, Options } from "~/@types";
import { emoji } from "~/shared/ui";
import { ICertOptions } from "./options";
import { hasShellCommandInPath } from "~/shared/observations/hasShellCommandInPath";
import { execSync } from "node:child_process";
import { askListQuestion } from "~/shared/interactive";
import { fileExists } from "~/shared/file";

function validateOpenSsl() {
  const hasOpenSsl = hasShellCommandInPath("openssl");

  if (!hasOpenSsl) {
    console.error(chalk`- ${emoji.poop} OpenSSL is not installed so stopping!`);
    exit(1);
  }
}

function validateSshKeygen() {
  const hasOpenSsl = hasShellCommandInPath("ssh-keygen");

  if (!hasOpenSsl) {
    console.error(chalk`- ${emoji.poop} ssh-keygen is not installed so stopping!`);
    exit(1);
  }
}

/**
 * Returns immediately if the file _does not_ exist, otherwise asks user for
 * their desired handling.
 */
async function handleDuplicateFile(file: string) {
  const exists = fileExists(file);
  if (exists) {
    return file;
  }

  enum choices {
    overwrite = "overwrite existing",
    rename = "change the cert's name to something else",
    quit = "quit creation of the cert",
  }

  const answer = (await askListQuestion(
    `The file "" exists already; choose how to handle this:`,
    Object.values(choices)
  )) as choices;

  return answer;
}

function ssh(o: ICertOptions) {
  // const filename = `id_${o.ssh_algo}`;

  const keyLength = o.keyLength && o.keyLength > 0 ? `-b ${o.keyLength}` : "";
  const emailTail = o.email ? ` -C ${o.email}` : "";
  const command = `ssh-keygen -t ${o.ssh_algo} ${keyLength}${emailTail}`;
  console.error(`- generating {bold {blue SSH key}}: {green ${command}}`);
}

/**
 * Generate a RSA signature locally
 */
function rsa(o: ICertOptions) {
  const pemFile = handleDuplicateFile(`${o.name}-key.pem`);

  const command = `openssl genrsa -${o.ssl_algo} -out ${pemFile} ${o.keyLength}`;
  console.error(`- generating {bold {blue RSA}}: {green ${command}}`);

  try {
    execSync(command, { encoding: "utf8" });
  } catch {
    console.error(chalk`- ${emoji.poop} problems generating the RSA key!`);
    exit(1);
  }
}

/**
 * Generate a certificate signing request (CSR)
 */
function csr(o: ICertOptions) {
  const command = `openssl req -new x509 -sha256 -days 365 -key ${o.name}-key.pem -out ${o.name}.pem`;
  try {
    execSync(command, { encoding: "utf8" });
  } catch {
    console.error(
      chalk`- ${emoji.poop} problems generating the CCR (certificate signing request)!`
    );
    exit(1);
  }
}

function createCA(o: Options<ICertOptions>) {
  validateOpenSsl();

  rsa(o);
  csr(o);
}

function createCertificate(o: Options<ICertOptions>) {
  console.error(`- generating SSL certificate`);
  validateOpenSsl();

  rsa(o);
  csr(o);
}

function createSSH(o: Options<ICertOptions>) {
  validateSshKeygen();
  ssh(o);
}

function certInfo(_o: Options<ICertOptions>) {
  console.log("not implemented");
}

export const handler: DoDevopsHandler<Options<ICertOptions>> = async ({ opts, subCommand }) => {
  const o: ICertOptions = {
    ssl_algo: "aes256",
    ssh_algo: opts.github ? "ed25519" : "rsa",
    ...opts,
  };
  o.name = subCommand === "ca" ? o.name || "ca" : o.name || "cert";

  switch (o.ssh_algo) {
    case "rsa":
      o.keyLength = o.keyLength || 4096;
      break;
    case "ecdsa":
      o.keyLength = o.keyLength || 521;
      break;
  }

  switch (subCommand) {
    case "ca":
      createCA(o);
      break;
    case "ssh":
      createSSH(o);
      break;
    case "certificate":
      createCertificate(o);
      break;
    case "info":
      certInfo(o);
      break;
  }
};
