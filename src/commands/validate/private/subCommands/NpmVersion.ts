import chalk = require("chalk");
import { emoji, gitTags, getPackageJson } from "~/shared";
import { ValidationAction } from "../../public";

export async function handler(action: ValidationAction, currentBranch: string) {
  console.log(
    chalk`- ${emoji.eyeballs} ensuring that all {italic semver} versions are ready for an {bold {yellow npm}} release`
  );
  const latest = (await gitTags()).latest;
  const pkgVersion = getPackageJson().version;
  const releaseTag = currentBranch.includes("release/")
    ? currentBranch.split("/")[1]
    : undefined;
  console.log(chalk`- the last semver tag in the remote is {bold {yellow ${latest}}}`);
  console.log(
    chalk`- the semver value in {italic package.json} is {bold {yellow ${pkgVersion}}}`
  );
  if (releaseTag) {
console.log(
      chalk`- the {italic release} branch has a tag of {bold {yellow ${releaseTag}}}`
    );
}

  if (releaseTag && releaseTag !== pkgVersion) {
    console.log(
      chalk`- ${emoji.poop} the release branch's tag and the package.json tag DO NOT match!\n`
    );
    return action === "error" ? 1 : 0;
  }

  if (latest === pkgVersion) {
    console.log(
      chalk`- ${emoji.poop} the package.json's version must be greater than what the remote already has!\n`
    );
    return action === "error" ? 1 : 0;
  }

  const [remoteMajor, remoteMinor, remotePatch] = (latest || "")
    .split(".")
    .map((i) => Number(i));
  const [localMajor, localMinor, localPatch] = pkgVersion
    .split(".")
    .map((i) => Number(i));

  const remoteValue = remoteMajor * 10000 + remoteMinor * 1000 + remotePatch;
  const localValue = localMajor * 10000 + localMinor * 1000 + localPatch;

  if (localValue < remoteValue) {
    console.log(
      chalk`- ${emoji.poop} the package.json's version is {bold {red less than}} the remote!\n`
    );
    return action === "error" ? 1 : 0;
  }

  const versionScope =
    localMajor > remoteMajor ? "major" : localMinor > remoteMinor ? "minor" : "patch";

  console.log(chalk`- ${emoji.party} versions appear to be ready to do a {bold {green ${versionScope}
}} NPM release`);
  return 0;
}
