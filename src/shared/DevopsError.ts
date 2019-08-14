export class DevopsError extends Error {
  public code: string;
  constructor(message: string, classification: string = "Devops/unknown") {
    super(message);
    const parts = classification.split("/");
    const [type, subType] = parts.length === 1 ? ["devops", parts[0]] : parts;
    this.name = `${type}/${subType}`;
    this.code = subType;
  }
}
