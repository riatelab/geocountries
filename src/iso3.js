import {getcode} from "./getcode.js"

export function iso3(data, name, threshold = 0.75) {
  const result = [];
  const names = Array.from(new Set(data.map((d) => d[name])));
  names.forEach((e) => {
    result.push([e, getcode(e, threshold)]);
  });
  return new Map(result);
}
