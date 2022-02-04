import {iso3} from "./iso3.js"
import {add} from "./add.js"

export function addiso3(_ = {}){
  return add({
    data: _.data,
    codes: iso3({
      json: _.data,
      name: _.name,
      threshold: _.treshold,
      patch: _.patch
    }),
    name: _.name
  });
}
