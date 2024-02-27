export function createFactory<T, R extends any[]>(_class: new (...args: R) => T, ...args: R): T {
  return new _class(...args);
}

export function toFixed(value: number, decimal = 2) {
  return +value.toFixed(decimal);
}
