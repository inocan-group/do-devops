import chalk from "chalk";
import { emoji } from "src/shared/ui";
import { hasShellCommandInPath } from "src/shared/observations/hasShellCommandInPath";
import { exit } from "node:process";
import { ICertOptions } from "./options";
import { Options } from "src/@types/global";
import { execSync } from "node:child_process";
import { askInputQuestion } from "src/shared/interactive";
import { nslookup } from "src/shared/network";
import { handleDuplicateFile } from "./handleDuplicateFile";
import { fileExists } from "src/shared/file/existance";
import { avoidDuplicationInExtFile } from "./dnsAppearsInExtFile";
import { readFileSync, writeFileSync } from "node:fs";

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
    console.error(chalk`- keep existing file [{dim ${o.name}-key.pem}]`);
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
  const filename = "extfile.cnf";

  // get good defaults
  let dns = o.name?.includes(`.${o.local_domain}`) ? o.name : `${o.name}.${o.local_domain}`;
  let ip = nslookup(dns);

  dns = await askInputQuestion("What is the DNS entry for this server?", { default: dns });
  ip = await askInputQuestion("What is the DNS entry for this server?", { default: `${ip}` });
  const resolution = await avoidDuplicationInExtFile(dns, ip || "");

  switch (resolution) {
    case "quit":
      console.log("bye.\n");
      exit(0);
    case "skip":
      console.error("- ok, skipping update to file [{dim extfile.cnf}]");
      break;
    case "overwrite":
      console.error("- updating {green extfile.cnf} with the new info");
      const data = readFileSync(filename, "utf8")
        .split("\n")
        .filter((i) => !i.includes(dns))
        .join("\n");
      writeFileSync(filename, data, "utf8");
      break;

    case "no-conflict":
      const command = `echo "subjectAltName=DNS:${dns},IP:${ip}" >> extfile.cnf`;
      console.error(chalk`- appending subject alternative name\n  {green ${command}}`);
      try {
        execSync(command, { encoding: "utf8", stdio: "inherit" });
        console.error(chalk`\n- appended [{dim extfile.cnf}] ${emoji.rocket}`);
      } catch {
        console.error("- ${emoji.poop} problems appending to the 'extfile.cnf' file!");
        exit(1);
      }
      break;
  }
}

async function fullchain_cert(o: ICertOptions) {
  const command = `openssl x509 -req -sha256 -days ${o.days} -in ${o.name}.csr -CA ca.pem -CAkey ca-key.pem -out ${o.name}.pem -extfile extfile.cnf -CAcreateserial`;
  try {
    console.error(chalk`- generating {bold {blue SSL Certificate}} for ${o.name}`);
    execSync(command, { encoding: "utf8", stdio: "inherit" });
    console.error(chalk`- SSL certificate created [${o.name}.pem] ${emoji.rocket}`);
  } catch (error) {
    console.error(chalk`- ${emoji.poop} ran into problems: ${(error as Error)?.message}`);
    exit(1);
  }

  try {
    console.error(
      chalk`- merging the created cert [{dim ${o.name}.pem}] with CA certificate [{dim ca.pem}]\n  into a fullchain cert [{dim ${o.name}.fullchain.pem}]`
    );
    const command2 = `cat ${o.name}.pem > ${o.name}.fullchain.pem && cat ca.pem >> ${o.name}.fullchain.pem`;
    console.error(chalk`  {bold {green ${command}}}\n`);
    execSync(command2, { encoding: "utf8", stdio: "inherit" });
    console.error(
      chalk`- Full Chain certificate created [{dim ${o.name}.fullchain.pem}] ${emoji.rocket}`
    );
  } catch (error) {
    console.error(chalk`- ${emoji.poop} ran into problems: ${(error as Error)?.message}`);
    exit(1);
  }
}

/**
 * Convert ASCII `pem` format to binary `der` format
 */
export async function pem_to_der(pemFile: string, _o: ICertOptions) {
  const derFile = `${pemFile.replace(".pem", "")}.der`;
  const command = `openssl x509 -outform der -in ${pemFile} -out ${derFile}`;
  try {
    console.error(chalk`- generating {bold {DER}} file from PEM:\n  {green ${command}}`);
    execSync(command, { encoding: "utf8", stdio: "inherit" });
    console.error(chalk`- DER created [${derFile}] ${emoji.rocket}`);
  } catch (error) {
    console.error(
      chalk`- ${emoji.poop} problems generating the DER file! ${(error as Error).message}`
    );
    exit(1);
  }
}

/**
 * Convert ASCII `pem` format to binary `pfx` format
 */
export async function pem_to_pfx(pemFile: string, _o: ICertOptions) {
  const pfxFile = `${pemFile.replace(".pem", "")}.pfx`;
  const command = `openssl x509 -outform pfx -in ${pemFile} -out ${pfxFile}`;
  try {
    console.error(chalk`- generating {bold {PFX}} file from PEM:\n  {green ${command}}`);
    execSync(command, { encoding: "utf8", stdio: "inherit" });
    console.error(chalk`- PFX created [${pfxFile}] ${emoji.rocket}`);
  } catch (error) {
    console.error(
      chalk`- ${emoji.poop} problems generating the PFX file! ${(error as Error).message}`
    );
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
  const csrFile = `${o.name}.csr`;
  const resolve = await handleDuplicateFile(csrFile);
  if (!resolve) {
    console.error(chalk`- skipping CSR file creation [{dim ${resolve}}]`);
    return;
  }
  const command = `openssl req -new -${o.csr_algo} -subj "/CN=${o.name}" -key ${caKey} -out ${csrFile}`;
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

export function verify_pem_cert(pemFile: string): [boolean, null | Error] {
  const command = `openssl verify -CAfile ca.pem -verbose ${pemFile}`;
  try {
    execSync(command, { encoding: "utf8", stdio: "inherit" });
    return [true, null];
  } catch (error) {
    return [false, error as Error];
  }
}

export async function createCertificate(o: Options<ICertOptions>) {
  validateOpenSsl();
  o.name = o.name || (await askInputQuestion("what is the name of the server?"));
  o.ssl_algo = undefined; // no signature needed
  await rsa(o);
  await cert_csr(o);
  await appendAlternativeNames(o);
  await fullchain_cert(o);
  const pemFile = `${o.name}.pem`;
  await pem_to_der(pemFile, o);
  // await pem_to_pfx(pemFile, o);
}

export async function createSSH(o: Options<ICertOptions>) {
  validateSshKeygen();
  await ssh(o);
}

export async function certInfo(_o: Options<ICertOptions>) {
  console.error(chalk`- sorry but this has not been implemented yet`);
  exit(0);
}
