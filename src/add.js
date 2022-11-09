import { csv } from "d3-fetch";
import { similarity } from "./levenshtein.js";

export async function add(
  params = {
    json: undefined,
    name: "name",
    threshold: 0.75,
    patch: undefined,
  }
) {
  let codes = await csv(
    `https://raw.githubusercontent.com/neocarto/geocountries/main/data/countries.csv`
  );

  function getcode(str, threshold = 0.9) {
    let result = [];

    codes.forEach((e) => {
      for (let i = 1; i < Object.keys(e).length; i++) {
        let sim = similarity(str, Object.values(e)[i]);

        result.push([Object.values(e)[0], sim]);
      }
    });

    result = result.sort((a, b) => {
      return b[1] - a[1];
    })[0];

    if (result[1] < threshold) {
      result = [undefined, 0];
    }

    return { name: str, iso3: result[0], score: result[1] };
  }

  const data = JSON.parse(JSON.stringify(params.json));
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
      result.push([e, { name: e, iso3: add.iso3, score: add.iso3 ? 1 : 0 }]);
    }
  });

  let mapcodes = new Map(result);

  let output = [];
  data.forEach((e) => {
    let tmp = mapcodes.get(e[name]);
    output.push(
      Object.assign(
        { iso3: tmp.iso3, iso3_score: Math.round(tmp.score * 100) / 100 },
        e
      )
    );
  });

  return output;
}
