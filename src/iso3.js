import {getcode} from "./getcode.js"

export function iso3(
  params = { json: undefined, name: "name", threshold: 0.75, patch: undefined }
){
  const data = params.json;
  const name = params.name;
  const threshold = params.threshold;
  const patch = params.patch;

  const result = [];
  const names = Array.from(new Set(data.map((d) => d[name])));
  names.forEach((e) => {
    const add = patch ? patch.find((d) => d.name == e) : undefined;
    if (add == undefined) {
      result.push([e, getcode(e, threshold)]);
    } else {
      result.push([e, { name: e, iso3: add.iso3, score: add.iso3 ? 1 : 0  }]);
    }
  });
  return new Map(result);
}
