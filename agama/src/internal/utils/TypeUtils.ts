/**
 * Construct a type with the properties of T except for those in type K.
 */
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * The keys of T which are strings.
 */
export type StringKeyOf<T> = Extract<keyof T, string>;

export type Values<T> = T[keyof T];

/**
 * The keys of T whose property value is of type U.
 */
// `T extends infer TT` is a hack to make this work with generic types, e.g. `<T, K extends StringPropertyKeysOf<T>>`
// https://github.com/microsoft/TypeScript/issues/38646#issuecomment-1054510795
export type KeysOfType<T, U> = T extends infer TT
  ? Values<{
      [P in keyof TT as TT[P] extends U ? P : never]: P;
    }>
  : never;

/**
 * The string keys of T whose property value is a string.
 */
export type StringPropertyKeysOf<T> = Extract<KeysOfType<T, string>, string>;

export const hasOwnProperty = {}.hasOwnProperty;
export const objectToString = {}.toString;

export function isDefined<T>(x: T | undefined | null): x is T {
  return x !== undefined && x !== null;
}

export function isUndefined(x: unknown): x is undefined {
  return x === undefined;
}

export function isNull(x: unknown): x is null {
  return x === null;
}

export function isNullOrUndefined(x: unknown): x is null | undefined {
  return x === null || x === undefined;
}

function isArrayPolyfill(arg: unknown): arg is unknown[] {
  return objectToString.call(arg) === '[object Array]';
}

export const isArray: <T = any>(arg: unknown) => arg is T[] = Array.isArray || isArrayPolyfill;

export function isArrayLike<T>(parameter: unknown): parameter is ArrayLike<T> {
  return isObject(parameter) && hasOwnProperty.call(parameter, 'length') && isNumber((parameter as ArrayLike<T>).length);
}

export function isObject(x: unknown): x is object {
  return typeof x === 'object' && x !== null;
}

export function isPlainObject(x: unknown): boolean {
  return isObject(x) && x.constructor && x.constructor === Object;
}

export function isString(parameter: unknown): parameter is string {
  return typeof parameter === 'string';
}

export function isBoolean(parameter: unknown): parameter is boolean {
  return typeof parameter === 'boolean';
}

export function isPromiseLike<T>(promiseLike: unknown): promiseLike is PromiseLike<T> {
  return Boolean(promiseLike) && typeof (promiseLike as PromiseLike<T>).then === 'function';
}

export function isDate(x: unknown): x is Date {
  return objectToString.call(x) === '[object Date]';
}

export function isNumber(x: unknown): x is number {
  return typeof x === 'number';
}
