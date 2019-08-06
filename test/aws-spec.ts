import {
  getDefaultAwsProfile,
  getAwsProfileList,
  hasAwsProfileCredentialsFile
} from "../src/shared/getAwsProfile";
import { expect } from "chai";

describe("AWS Credentials => ", () => {
  it("Credentials file is found and produces structured information", async () => {
    const credentialsFile = hasAwsProfileCredentialsFile();

    if (!credentialsFile) {
      console.log("this test will not run as there is not a credentials file");
    } else {
      const profile = await getAwsProfileList();

      expect(profile).not.equal(false);
      if (profile) {
        expect(profile).to.be.an("object");
        const firstKey = Object.keys(profile).pop();
        expect(profile[firstKey]).to.be.an("object");
        expect(Object.keys(profile[firstKey])).to.include("aws_access_key_id");
        expect(Object.keys(profile[firstKey])).to.include(
          "aws_secret_access_key"
        );
      } else {
        console.log("This condition should not be met");
      }
    }
  });
});
