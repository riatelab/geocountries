export function duplicate(
  params = {
    json: undefined,
    field: "name",
  }
) {
  const a = params.json.map((d) => d[params.field]);
  return Array.from(
    new Set(a.filter((item, index) => a.indexOf(item) !== index))
  );
}
