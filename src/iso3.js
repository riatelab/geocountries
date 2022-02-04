iso3 = function (data, name, threshold = 0.75) {
  const result = [];
  const names = Array.from(new Set(data.map((d) => d[name])));
  names.forEach((e) => {
    let r = geocountries.getcode(e);
    if (r.score <= threshold) {
      r = { name: e, iso3: undefined, score: 0 };
    }
    result.push([e, r]);
  });
  return new Map(result);
}
