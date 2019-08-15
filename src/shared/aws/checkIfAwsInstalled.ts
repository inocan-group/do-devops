import { asyncExec } from "async-shelljs";
/**
 * Tests whether the executing environment has the **AWS CLI**
 * available.
 */
export async function checkIfAwsInstalled() {
  try {
    const test = asyncExec(`aws`, { silent: true });
    return true;
  } catch (e) {
    return false;
  }
}
