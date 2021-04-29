import { isTypeSubtype, TypeSubtype } from "common-types";

export class DevopsError extends Error {
  public readonly kind: "DevopsError" = "DevopsError";
  public readonly classification: TypeSubtype;
  public code: string;
  constructor(message: string, classification: string = "do-devops/unknown") {
    super(message);
    const parts = classification.split("/");
    const [type, subType] = parts.length === 1 ? ["devops", parts[0]] : parts;
    this.name = `${type}/${subType}`;
    this.code = subType;
    this.classification = isTypeSubtype(classification)
      ? classification
      : (`do-devops/${classification.replace(/\//g, "")}` as TypeSubtype);
  }
}
