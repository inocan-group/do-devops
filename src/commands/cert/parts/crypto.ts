import chalk from "chalk";
import { emoji } from "~/shared/ui";
import { hasShellCommandInPath } from "~/shared/observations/hasShellCommandInPath";
import { exit } from "node:process";
import { ICertOptions } from "./options";
import { Options } from "~/@types/global";
import { execSync } from "node:child_process";
import { askInputQuestion } from "~/shared/interactive";
import { nslookup } from "~/shared/network";
import { handleDuplicateFile } from "./handleDuplicateFile";
import { fileExists } from "~/shared/file/existance";
import { dnsAppearsInExtFile } from "./dnsAppearsInExtFile";

export function validateOpenSsl() {
  const hasOpenSsl = hasShellCommandInPath("openssl");

  if (!hasOpenSsl) {
    console.error(chalk`- ${emoji.poop} OpenSSL is not installed so stopping!`);
    exit(1);
  }
}

export function validateSshKeygen() {
  const hasOpenSsl = hasShellCommandInPath("ssh-keygen");

  if (!hasOpenSsl) {
    console.error(chalk`- ${emoji.poop} ssh-keygen is not installed so stopping!`);
    exit(1);
  }
}

export async function ssh(o: ICertOptions) {
  const filename = await handleDuplicateFile(`id_${o.ssh_algo}`);
  const keyLength = o.keyLength && o.keyLength > 0 ? `-b ${o.keyLength}` : "";
  const emailTail = o.email ? ` -C ${o.email}` : "";
  const command = `ssh-keygen -t ${o.ssh_algo} ${keyLength}${emailTail} ${filename}`;
  console.error(`- generating {bold {blue SSH key}}: {green ${command}}`);
}

/**
 * Generate a RSA signature locally
 */
export async function rsa(o: ICertOptions) {
  const pemFile = await handleDuplicateFile(`${o.name}-key.pem`);
  if (!pemFile) {
    console.error(chalk`- keep existing file [{dim ${o.name}-key.pem}}]`);
    return;
  }
  if (pemFile === "quit") {
    console.error(chalk`- exiting RSA and certification process`);
    exit(0);
  }

  const command = `openssl genrsa ${o.ssl_algo ? `-${o.ssl_algo}` : ""} -out ${pemFile} ${
    o.keyLength
  }`;
  console.error(chalk`- generating {bold {blue RSA CA Cert}}:\n  {green ${command}}`);

  try {
    execSync(command, { encoding: "utf8" });
    console.error(chalk`- RSA key created [${pemFile}] ${emoji.rocket}\n`);
  } catch {
    console.error(chalk`- ${emoji.poop} problems generating the RSA key!`);
    exit(1);
  }
}

async function appendAlternativeNames(o: ICertOptions) {
  // get good defaults
  let dns = o.name?.includes(`.${o.local_domain}`) ? o.name : `${o.name}.${o.local_domain}`;
  if (dnsAppearsInExtFile(dns)) {
    exit(0); // TODO
  }
  let ip = nslookup(dns);

  dns = await askInputQuestion("What is the DNS entry for this server?", { default: dns });
  ip = await askInputQuestion("What is the DNS entry for this server?", { default: `${ip}` });

  const command = `echo "subjectAltName=DNS:${dns},IP:${ip}" >> extfile.cnf`;
  console.error(chalk`- appending subject alternative name\n  {green ${command}}`);
  try {
    execSync(command, { encoding: "utf8", stdio: "inherit" });
    console.error(chalk`\n- appended [{dim extfile.cnf}] ${emoji.rocket}`);
  } catch {
    console.error("- ${emoji.poop} problems appending to the 'extfile.cnf' file!");
    exit(1);
  }
}

/**
 * Generate a certificate signing request (CSR)
 */
export async function ca_csr(o: ICertOptions) {
  const command = `openssl req -new -x509 -${o.csr_algo} -days ${o.days} -key ${o.name}-key.pem -out ${o.name}.pem`;
  try {
    console.error(
      chalk`- generating {bold {blue Certificate Signing Request (CCR)}}:\n  {green ${command}}`
    );
    execSync(command, { encoding: "utf8", stdio: "inherit" });
    console.error(chalk`- CSR created [${o.name}] ${emoji.rocket}`);
  } catch {
    console.error(
      chalk`- ${emoji.poop} problems generating the CCR (certificate signing request)!`
    );
    exit(1);
  }
}

export async function cert_csr(o: ICertOptions) {
  const caKey = fileExists("ca-key.pem")
    ? "ca-key.pem"
    : await askInputQuestion(
        "Typically you'd call this command in a directory which has your CA Certificate named 'ca-key.pem' but this file doesn't exist. Please let us know where to find this file"
      );
  const command = `openssl req -new -${o.csr_algo} -subj "/CN=${o.name}" -key ${caKey} -out ${o.name}.csr`;
  const ipAddress = nslookup(`${o.name}.local`);
  console.log("ipAddress:", ipAddress);

  try {
    console.error(
      chalk`- generating {bold {blue Certificate Signing Request (CCR)}}:\n  {green ${command}}`
    );
    execSync(command, { encoding: "utf8", stdio: "inherit" });
    console.error(chalk`- CSR created [${o.name}] ${emoji.rocket}`);
  } catch (error) {
    console.error(
      chalk`- ${emoji.poop} problems generating the CCR (certificate signing request)!\n\n${error}`
    );
    exit(1);
  }
}

export async function createCA(o: Options<ICertOptions>) {
  validateOpenSsl();

  await rsa(o);
  await ca_csr(o);
}

export async function createCertificate(o: Options<ICertOptions>) {
  validateOpenSsl();
  o.name = o.name || (await askInputQuestion("what is the name of the server?"));
  o.ssl_algo = undefined; // no signature needed
  await rsa(o);
  await cert_csr(o);
  await appendAlternativeNames(o);
}

export async function createSSH(o: Options<ICertOptions>) {
  validateSshKeygen();
  await ssh(o);
}

export async function certInfo(_o: Options<ICertOptions>) {
  console.error(chalk`- sorry but this has not been implemented yet`);
  exit(0);
}
