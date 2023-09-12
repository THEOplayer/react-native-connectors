export function stringContains_(string: string | undefined | null, search: string): boolean {
  return string !== undefined && string !== null && string.indexOf(search) !== -1;
}

export function stringStartsWith(string: string | undefined | null, search: string): boolean {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith#Polyfill
  return string !== undefined && string !== null && string.substr(0, search.length) === search;
}
