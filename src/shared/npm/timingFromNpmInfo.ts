import { INpmInfo } from "common-types";
import { first, last } from "native-dash";
import { INpmTiming } from "src/@types";

/**
 * If you pass in the **npm** info data structure [`INpmInfo`] then this will
 * pull off:
 *
 * - the _latest_ timestamp and version tag
 * - the _first_ timestamp and version tag
 * - and the named properties of `created` and `modified`
 *
 * If no release timing is available (not sure this can happen) then this
 * function will return false
 */
export function timingFromNpmInfo(info: INpmInfo): INpmTiming {
  const timing = info.time;

  const timingArr = Object.keys(timing)
    .map((i) => ({ tag: i, timestamp: timing[i] }))
    .filter((i) => !["created", "modified"].includes(i.tag))
    .sort((a, b) => new Date(a.tag).getTime() - new Date(b.tag).getTime());

  const f = first(timingArr);
  const l = last(timingArr);

  return {
    created: timing.created,
    modified: timing.modified,
    first: { tag: f.tag, timestamp: f.timestamp },
    last: { tag: l.tag, timestamp: l.timestamp },
  };
}
