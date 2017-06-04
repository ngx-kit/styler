export function objectFilter(raw: any, filter: string[]): any {
  return Object.keys(raw)
      .filter(key => !filter.includes(key))
      .reduce((obj, key) => {
        obj[key] = raw[key];
        return obj;
      }, {});
}
