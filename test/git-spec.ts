import { expect } from "chai";
import { findOrgFromGitRemote, getGitRemotes } from "../src/shared";

describe("git shared functions", () => {
  it("getGitRemotes() has one remote", async () => {
    const remotes = await getGitRemotes();
    expect(remotes).to.be.lengthOf(1);
  });

  it("getGitRemotes() returns proper details", async () => {
    const remotes = (await getGitRemotes()).pop();
    expect(remotes.name).to.equal("origin");
    expect(remotes.refs.fetch).includes("do-devops");
    expect(remotes.refs.push).includes("do-devops");
  });

  it("findOrgFromGitRemote() returns github organisation name", async () => {
    const org = await findOrgFromGitRemote();
    expect(org).to.equal("inocan-group");
  });
});
