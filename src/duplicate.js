export function duplicate(a){
  return Array.from(new Set(a.filter((item, index) => a.indexOf(item) !== index)))
}
