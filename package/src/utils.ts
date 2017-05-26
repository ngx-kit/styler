export function clone(obj: any) {
  if (obj === null || typeof(obj) !== 'object' || 'isActiveClone' in obj)
    return obj;

  let temp = obj instanceof Date
      ? new Date(obj)
      : obj.constructor();

  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      obj['isActiveClone'] = null;
      temp[key] = clone(obj[key]);
      delete obj['isActiveClone'];
    }
  }

  return temp;
}

export function isString(x: any): x is string {
  return typeof x === "string";
}

export function isDefined(val: any): boolean {
  return val !== null && val !== undefined;
}