import { getAwsProfile, getAwsProfileList, hasAwsProfileCredentialsFile } from "../src/shared";

import { expect } from "chai";

describe("AWS Credentials => ", () => {
  it("getAwsProfileList() finds credentials file and produces structured information", async () => {
    const credentialsFile = hasAwsProfileCredentialsFile();

    if (!credentialsFile) {
      console.log("this test will not run as there is not a credentials file");
    } else {
      const profiles = await getAwsProfileList();

      expect(profiles).not.equal(false);
      if (profiles) {
        expect(profiles).to.be.an("object");
        const firstKey = Object.keys(profiles).pop() as string;
        expect(profiles[firstKey]).to.be.an("object");
        expect(Object.keys(profiles[firstKey])).to.include("aws_access_key_id");
        expect(Object.keys(profiles[firstKey])).to.include("aws_secret_access_key");
      } else {
        console.log("This condition should not be met");
      }
    }
  });

  it("getAwsProfile() gets a named AWS profile from credentials file", async () => {
    const credentialsFile = hasAwsProfileCredentialsFile();

    if (!credentialsFile) {
      console.log("this test will not run as there is not a credentials file");
    } else {
      const profiles = await getAwsProfileList();
      expect(profiles).to.be.an("object");
      for (const p of Object.keys(profiles)) {
        const profile = profiles[p as keyof typeof profiles];
        expect(Object.keys(profile)).to.include("aws_access_key_id");
        expect(Object.keys(profile)).to.include("aws_secret_access_key");
      }
    }
  });

  it("getAwsProfile() fails with appropriate error if named profile does not exist", async () => {
    const credentialsFile = hasAwsProfileCredentialsFile();

    if (!credentialsFile) {
      console.log("this test will not run as there is not a credentials file");
    } else {
      try {
        const profile = await getAwsProfile("does-not-exist");
        console.log(profile);

        throw new Error("should have thrown error before getting here!");
      } catch (error) {
        expect(error.code).to.equal("not-ready");
      }
    }
  });
});
