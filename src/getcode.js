import {similarity} from "./levenshtein.js"
import {codes} from "./codes.js"

export function getcode(str, threshold = 0.9){
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

  if (result[1] < threshold) {result = [undefined, 0]}

  return { name:str, iso3: result[0], score: result[1] };
}
