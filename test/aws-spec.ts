import { getAwsProfile, getAwsProfileList, hasAwsProfileCredentialsFile } from "~/shared/aws";

describe("AWS Credentials => ", () => {
  it("getAwsProfileList() finds credentials file and produces structured information", async () => {
    const credentialsFile = hasAwsProfileCredentialsFile();

    if (!credentialsFile) {
      console.log("this test will not run as there is not a AWS credentials file");
    } else {
      const profiles = await getAwsProfileList();

      expect(profiles.length).toBeGreaterThanOrEqual(1);
      for (const p of profiles) {
        expect(typeof p).toBe("object");
        expect(typeof p.aws_access_key_id).toBe("string");
        expect(typeof p.aws_secret_access_key).toBe("string");
        expect(typeof p.name).toBe("string");
      }
    }
  });

  it("getAwsProfile() gets a named AWS profile from credentials file", async () => {
    const credentialsFile = hasAwsProfileCredentialsFile();

    if (!credentialsFile) {
      console.log("this test will not run as there is not a credentials file");
    } else {
      const profiles = await (await getAwsProfileList()).map((i) => i.name);
      for (const p of profiles) {
        const profile = await getAwsProfile(p);
        expect(typeof profile).toBe("object");
        expect(typeof profile.aws_access_key_id).toBe("string");
        expect(typeof profile.aws_secret_access_key).toBe("string");
        expect((profile as any).name).toBeUndefined();
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
        expect(error.code).toBe("invalid-profile-name");
      }
    }
  });
});
