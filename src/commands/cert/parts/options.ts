import { OptionDefn } from "src/@types/option-types";

export const options: OptionDefn = {
  name: {
    alias: "n",
    type: String,
    group: "local",
    description: "optionally specify the name of the certificate",
  },
  ssh: {
    type: Boolean,
    group: "local",
    description: "create an SSH certificate locally",
  },
  ssl: {
    type: Boolean,
    group: "local",
    description: "create an SSL certificate locally",
  },
  days: {
    type: Number,
    group: "local",
    description: "the number of days a certificate will valid for (default 3650)",
  },
  ssl_algo: {
    alias: "s",
    typeLabel: "<algo name>",
    type: String,
    group: "local",
    description: "the signing algo to use with SSL (default is 'aes256')",
  },

  ssh_algo: {
    type: String,
    group: "local",
    description: "the algo used; typically RSA but github now uses ed25519",
  },

  github: {
    type: Boolean,
    group: "local",
    description: "express the desire to create an SSH cert but not with RSA but ed25519",
  },

  keyLength: {
    type: Number,
    alias: "l",
    typeLabel: "<length>",
    group: "local",
    description: "cert key length; RSA defaults to 4096",
  },

  email: {
    type: String,
    alias: "e",
    typeLabel: "<you@somewhere.net>",
    group: "local",
    description: "the email you want to add to the end of the SSH cert",
  },

  local_domain: {
    type: String,
    alias: "d",
    typeLabel: "<local|home|etc>",
    group: "local",
    description: "the local DNS domain to use as a default (uses 'local' by default)",
  },
};

export interface ICertOptions {
  ssl?: boolean;
  ssh?: boolean;
  name?: string;
  /**
   * Whether to use the `ed25519` encryption instead of RSA for the SSH
   * certificate. Note: Github only takes `ed25519` now as it sees this
   * as more secure. You may also use `--github` flag to have same effect.
   *
   * @default false
   */
  ed25519?: boolean;

  /**
   * Indicates you want to create an SSH key for github (which requires non RSA key)
   *
   * @default false
   */
  github?: boolean;

  /**
   * The signing algorithm used for SSL
   *
   * @default "aes256"
   */
  ssl_algo?: string;

  /**
   * The signing algo used in CSR
   *
   * @default "sha256"
   */
  csr_algo?: string;

  /**
   * The number of days for which a certificate will be valid
   */
  days?: number;

  /**
   * The algorithm used in SSH; defaults to "rsa" unless "--github" flag is used
   * in which case it will switch to "ed25519"
   *
   * Note: algo choice dictates appropriate key sizes and appropriate defaults will
   * be set.
   */
  ssh_algo?: "rsa" | "dsa" | "ecdsa" | "ed25519";

  /**
   * When looking for a DNS name in your local DNS server (should it exist)
   * we will look for the "name" you gave us with the suffix ".local" for a
   * DNS domain but you can change that if you prefer "home" or something
   * else.
   */
  local_domain?: string;

  /**
   * Allows specifying the key length you want
   */
  keyLength?: number;

  /**
   * The email to append to an SSH key
   */
  email?: string;
}
