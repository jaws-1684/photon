import type { HttpErrorStatus, PRequestConfig, StatusHandler, CacheKey } from "./types/types.index.ts";
import { body, type PBody } from "./body.ts";
import { pfetch } from "./fetch.ts";
import { presponse } from "./response.ts";

export class PRequest {
    #config: PRequestConfig;
    constructor(config: PRequestConfig) {
        this.#config = config;
    }
    body(input: ((b: PBody) => PBody) | Record<string, unknown>): PRequest {
        const resolved = typeof input === "function"
            ? input(body())
            : body().json(input);

        return new PRequest(
            { ...this.#config, body: resolved });
    }

    params(p: Record<string, string>): PRequest {
        return new PRequest({ ...this.#config, params: p });
    }
    key(key?: CacheKey) {
        const requestKey = (typeof key === "string" && key.length >= 1) 
            ? key
            : this.#key;
        return new PRequest({...this.#config, key: requestKey });
    }
    notFound(fn: StatusHandler): PRequest {
        return new PRequest({ ...this.#config, statusHandlers: { 
            ...this.#config.statusHandlers, 404: fn 
        }});
    }
    unprocessable(fn: StatusHandler): PRequest {
        return new PRequest({ ...this.#config, statusHandlers: { 
            ...this.#config.statusHandlers, 422: fn 
        }});
    }
    unauthorized(fn: StatusHandler): PRequest {
        return new PRequest({ ...this.#config, statusHandlers: { 
            ...this.#config.statusHandlers, 401: fn 
        }});
    }
    error(status: HttpErrorStatus, fn: StatusHandler): PRequest {
        return new PRequest({ ...this.#config, statusHandlers: { 
            ...this.#config.statusHandlers, [status]: fn 
        }});
    }
    async json<T>() {
        const result = await this.#presponse();
        if (result.ok) {
            return presponse<T>(result.data).json();
        }
        return result;
    }

    async text() {
        const result = await this.#presponse();
        if (result.ok) {
            return presponse(result.data).text();
        }
        return result;
    }

    async raw() {
        const result = await this.#presponse();
        if (result.ok) {
            return presponse(result.data).raw();
        }
        return result;
    }
    async #presponse() {
        const response = await pfetch({
            ...this.#config,
            fullUrl: this.#fullUrl ?? "",
            init: this.#init,
            key: this.#config.key ?? this.#key
        }).exec();
        if (response.ok) {
            const handler = this.#config.statusHandlers?.[response.status as HttpErrorStatus];
            if (handler) handler(response.data);
        }
        return response;
    };
    signal(s: AbortSignal): PRequest {
        return new PRequest({ ...this.#config, signal: s });
    }
    get #fullUrl()  {
        const { baseUrl, url, params } = this.#config;
        const full = baseUrl ? `${baseUrl}${url}` : url;
        if (!params || !Object.keys(params).length) return full;
        return `${full}?${new URLSearchParams(params)}`;
    }
    get #key(): CacheKey {
        return `${this.#config.method}:${this.#fullUrl}`;
    }
    get #init(): RequestInit {
        const { method, body, headers } = this.#config;
        return  {
            method,
            headers: { ...body?.headers, ...headers },
            body: body?.data ?? undefined
        };
    }
}
export const request = (config: PRequestConfig) => new PRequest(config);