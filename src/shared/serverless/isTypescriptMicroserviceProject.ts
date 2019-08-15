import { isServerless } from "./isServerless";

/**
 * Returns a boolean flag on whether or not this project appears to be
 * based on the `typescript-microservice` yeoman template.
 */
export function isTypescriptMicroserviceProject() {
  const status = isServerless();
  return status && status.isUsingTypescriptMicroserviceTemplate ? true : false;
}
