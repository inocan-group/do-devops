import { formatDistance } from "date-fns";

export function durationSince(from: Date, to?: Date) {
  return formatDistance(to ? to : Date.now(), from);
}