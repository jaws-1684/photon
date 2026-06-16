import type { Either, Err, Ok } from "./types/types.index";

export const isErr = <O>(obj: Either<O>): obj is Err => obj.ok === false;
export const isOk = <O>(obj: Either<O>): obj is Ok<O> => obj.ok === true;
export const isResponse = (obj: unknown): obj is Response => obj instanceof Response;
export const err = ({ error, status }: { error: unknown, status?: number }): Err => ({
  ok: false,
  error,
  status
});
export const ok = <T>({ data, status = 200 }: { data: T, status?: number }): Ok<T> => ({ ok: true, data, status });
export const deepCopy = <T extends Record<PropertyKey, unknown>, S extends Record<PropertyKey, unknown>>(target: T, source: S) => {
    const result: Record<PropertyKey, unknown> = { ...target };
    for (const [key, value] of Object.entries(source)) {
        if (key in target) {
            if (Array.isArray(target[key]) && Array.isArray(source[key])) {
                result[key] = [...target[key] as unknown[], ...source[key] as unknown[]];
            } else if (typeof target[key] === "object" && typeof source[key] === "object") {
              result[key] = deepCopy(target[key] as T, source[key] as S);
            } else {
              result[key] = value;
            };
        } else {
          result[key] = value;
        };
    };
    return result as T & S;
}; 