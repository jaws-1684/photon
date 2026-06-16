export type Content =
  'application/json'
  |
  'multipart/form-data'
  |
  'application/x-www-form-urlencoded'
  |
  'text/plain';
export type Tokens =
  'Bearer'
  |
  'Basic'
  |
  'Digest'
  |
  'ApiKey'
  |
  'Token'
  |
  'OAuth';
export type Authorization = `${Tokens} ${string}`;
export type Accept =
  'application/json'
  |
  'text/plain'
  |
  '*/*';
export type Method =
    "GET"
    |
    "POST"
    |
    "PUT"
    |
    "PATCH"
    |
    "DELETE";
export type CustomValue = (string & {});    
export type KnownHeaders = {
    "X-CSRF-Token": string;
    "Content-Type": Content & CustomValue;
    "Accept": Accept & CustomValue;
    "Authorization": Authorization & CustomValue;
    "User-Agent": string;
};
export type HeaderKey = keyof KnownHeaders;
export type HeaderValue<K extends HeaderKey> = KnownHeaders[K];
export type RawHeaders = Partial<KnownHeaders> & Record<string, string>;
export type Ok<T> = { ok: true; data: T; status: number };
export type Err = { ok: false; error: unknown; status?: number };
export type Either<T> = Ok<T> | Err;
export type RetryStatus = (408 | 429 | 500 | 502 | 503 | 504) & (number & {});
export type CacheKey = `${Method}:${string}` & CustomValue;