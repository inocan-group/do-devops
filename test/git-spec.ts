import { findOrgFromGitRemote, getGitRemotes } from "../src/shared";

describe("git shared functions", () => {
  it("getGitRemotes() has one remote", async () => {
    const remotes = await getGitRemotes();
    expect(remotes).toHaveLength(1);
  });

  it("getGitRemotes() returns proper details", async () => {
    const remotes = (await getGitRemotes()).pop();
    expect(remotes).not.toBeUndefined();
    if (remotes) {
      expect(remotes.name).toBe("origin");
      expect(remotes.refs.fetch.includes("do-devops")).toBeTruthy();
      expect(remotes.refs.push.includes("do-devops")).toBeTruthy();
    }
  });

  it("findOrgFromGitRemote() returns github organisation name", async () => {
    const org = await findOrgFromGitRemote();
    expect(org).toBe("inocan-group");
  });
});
