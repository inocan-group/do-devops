"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevopsError = void 0;
class DevopsError extends Error {
    constructor(message, classification = "Devops/unknown") {
        super(message);
        const parts = classification.split("/");
        const [type, subType] = parts.length === 1 ? ["devops", parts[0]] : parts;
        this.name = `${type}/${subType}`;
        this.code = subType;
    }
}
exports.DevopsError = DevopsError;
