import { cache } from "./cache.ts";
import { dedupe } from "./dedupe.ts";
import type { BuiltRequest, Either, Interceptor, PRequestConfig } from "./types/types.index.ts";
import { err, ok } from "./utils.ts";

const DEFAULT_RETRY_STATUS = [408, 429, 500, 502, 503, 504];
type PFetchConfig = {
    fullUrl: string
    init: RequestInit
    key: string
    signal?: AbortSignal
} & PRequestConfig;

export class PFetch {
    #config: PFetchConfig;
    #timeout: number;
    #signal: AbortSignal;
    #controller: AbortController;
    #interceptors: Interceptor;
    constructor(config: PFetchConfig) {
        this.#config = config;
        this.#timeout = config.timeout ?? 10_000;
        this.#controller = new AbortController();
        this.#signal = config.signal ?? this.#controller.signal;
        this.#interceptors = config.interceptors;
    }
    async exec(): Promise<Either<Response>> {
         const { key } = this.#config;
        if (this.#config.cache) {
            const cached = cache.get(key);
            if (cached) return ok({ data: cached.clone() });  
        }
        if(this.#config.dedupe) {
            const deduped = dedupe.get(key);
            if(deduped) {
                const response = await this.#onResponse(deduped);
                return ok({ data: response });
            };
        }
        return this.#attempt();
    };
    async #attempt(attemptCount=0): Promise<Either<Response>> {
        const timeoutId = setTimeout(
            () => this.#controller.abort(),
            this.#timeout ?? 10_000
        );
        try {
            const { key, fullUrl, init } = this.#onRequest();
            const promise = fetch(fullUrl, {
                ...init,
                signal: this.#signal
            });
            if(this.#config.dedupe) dedupe.set(key, promise);
            const response = await this.#onResponse(promise);
            if (this.#shouldRetry(response, attemptCount + 1)) return this.#attempt(++attemptCount);
           
            if(this.#config.cache && this.#config.method == "GET") cache.set(key, response.clone());
            return ok({ data: response, status: response.status });
        } catch(e) {
            if (e instanceof DOMException && e.name === "AbortError") {
                return err({error: "Request timed out" });
            }
            return err({error: e });
        } finally {
            clearTimeout(timeoutId);
        }   
    }
    #shouldRetry(response: Response, attempt: number) {
        const { retries, retryStatuses} = this.#config;
        const { ok, status } = response;
        if(ok) return false;
        if (typeof status !== "number") return false;
        if (attempt > retries) return false;
        const statuses = retryStatuses?.length ? retryStatuses : DEFAULT_RETRY_STATUS; 
        return statuses.includes(status);
    }
    #onRequest(): BuiltRequest {
        let { fullUrl, init, key } = this.#config;
        for (const requestInterceptor of this.#interceptors.onRequest) {
           ({ fullUrl, init, key } = requestInterceptor({ fullUrl, init, key }));
        };
        return { fullUrl, init, key };
    };
    async #onResponse(promise: Promise<Response>) {
        let response = await promise;
        for (const responseInterceptor of this.#interceptors.onResponse) {
                response = await responseInterceptor(response.clone());
        };
        return response;
    }
};
export const pfetch = (config: PFetchConfig) => new PFetch(config);