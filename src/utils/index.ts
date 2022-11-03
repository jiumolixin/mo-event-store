export function isObject(obj:any) {
    var type = typeof obj;
    return type === 'object' && !!obj;
  }
  