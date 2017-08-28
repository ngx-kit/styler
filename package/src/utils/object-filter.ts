export function objectFilter(raw: any, filter: string[]): any {
  return Object.keys(raw)
      .filter(key => filter.indexOf(key) === -1)
      .reduce((obj, key) => {
        obj[key] = raw[key];
        return obj;
      }, {});
}
