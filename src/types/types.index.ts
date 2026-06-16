import type { RawHeaders, Method } from "./types.core.ts";
import type { PHeader } from "../header.ts";
import type { PBody } from "../body.ts";
export * from "./types.core.ts";

export type PhotonConfig = {
  baseUrl?: string;
  headers?: RawHeaders;
  url?: string;
  timeout?: number;
  ttl?: number;
  dedupe?: boolean;
  cache?: boolean;
  retries: number;
  retryStatuses?: Array<number>;
  interceptors: Interceptor
};
export type PRequestConfig = PhotonConfig & {
  method: Method;
  body?: PBody;
  params?: Record<string, string>;
  signal?: AbortSignal;
  key?: string;
  statusHandlers?: StatusHandlers;
};
export type Interceptor = {
  onRequest: RequestInterceptor[];
  onResponse: ResponseInterceptor[];
};
export type BuiltRequest = { init: RequestInit, fullUrl: string, key: string };
export type RequestInterceptor = (request:  BuiltRequest ) => BuiltRequest;
export type ResponseInterceptor = (request:  Response ) => Promise<Response>;
export type HeaderInput =  RawHeaders | ((h: PHeader) => PHeader);
export type HttpErrorStatus = 
    | 400 | 401 | 403 | 404 | 405 
    | 408 | 409 | 410 | 422 | 429
    | 500 | 502 | 503 | 504;

export type StatusHandler = (response: Response) => unknown;
export type StatusHandlers = Partial<Record<HttpErrorStatus, StatusHandler>>;
