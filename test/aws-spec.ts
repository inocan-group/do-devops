import { getAwsProfile, getAwsProfileList, hasAwsProfileCredentialsFile } from "../src/shared";

describe("AWS Credentials => ", () => {
  it("getAwsProfileList() finds credentials file and produces structured information", async () => {
    const credentialsFile = hasAwsProfileCredentialsFile();

    if (!credentialsFile) {
      console.log("this test will not run as there is not a credentials file");
    } else {
      const profiles = await getAwsProfileList();

      expect(profiles).not.toBe(false);
      if (profiles) {
        expect(typeof profiles).toBe("object");
        const firstKey = Object.keys(profiles).pop() as string;
        expect(profiles[firstKey]).toBe("object");
        expect(Object.keys(profiles[firstKey]).includes("aws_access_key_id")).toBeTruthy();
        expect(Object.keys(profiles[firstKey]).includes("aws_secret_access_key")).toBeTruthy();
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
      expect(profiles).toBe("object");
      for (const p of Object.keys(profiles)) {
        const profile = profiles[p as keyof typeof profiles];
        expect(Object.keys(profile).includes("aws_access_key_id")).toBeTruthy();
        expect(Object.keys(profile).includes("aws_secret_access_key")).toBeTruthy();
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
        expect(error.code).toBe("not-ready");
      }
    }
  });
});
