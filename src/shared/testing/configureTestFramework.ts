import { TestObservation, Observations } from "~/@types";
import { templateFileCopy } from "~/shared/file";
import { installDevDep } from "~/shared/npm";
import { getProjectConfig } from "../config";

export async function configureTestFramework(
  framework: TestObservation,
  observations: Observations
) {
  const known: TestObservation[] = ["jest", "mocha", "uvu"];
  const config = getProjectConfig();
  const testPattern = 
  if (!known.includes(framework)) {
    console.log(`- sorry but currently only know how to install: ${known.join(", ")}`);
    console.log(`- please ensure that you install the required dependencies for "${framework}"`);
    return false;
  }

  let installed: boolean;
  switch (framework) {
    case "uvu":
      templateFileCopy("test/uvu/example-spec.ts", "test/example-spec.ts");
      break;
    case "jest":
      installed = await installDevDep(observations, "jest", "");
  }
}
