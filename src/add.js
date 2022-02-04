export function add(_ = {}){
  let result = [];
  _.data.forEach((e) => {
    result.push(Object.assign({ iso3: _.codes.get(e[_.name]).iso3 },e));
  });
  return result;
}
