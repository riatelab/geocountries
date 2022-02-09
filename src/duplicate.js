export function duplicate(a){
  Array.from(new Set(a.filter((item, index) => a.indexOf(item) !== index)))
}
