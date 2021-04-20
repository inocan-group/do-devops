import { asyncExec } from "async-shelljs";
/**
 * Tests whether the shell environment has the **AWS CLI**
 * available.
 */
export async function checkIfAwsInstalled() {
  try {
    await asyncExec("aws", { silent: true });
    return true;
  } catch {
    return false;
  }
}
