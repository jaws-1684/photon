import { type PRequest, request } from "./request.ts";
import { type PHeader, header } from "./header.ts";
import type { CacheKey, Method, PhotonConfig, RawHeaders, RetryStatus } from "./types/types.index.ts";
import { pinterceptor, type PInterceptor } from "./interceptor.ts";
import { deepCopy } from "./utils.ts";
import { cache } from "./cache.ts";

export class Photon{
    config: PhotonConfig;
    constructor(config: PhotonConfig) {
        this.config = config;
    }

    baseUrl(url: string): Photon {
        return new Photon({ ...this.config, baseUrl: url });
    }
    url(url: string): Photon {
        return new Photon({ ...this.config, url: url });
    }
    timeout(ms: number): Photon {
        return new Photon({ ...this.config, timeout: ms });
    }

    headers(input: RawHeaders | ((h: PHeader) => PHeader)): Photon {
        const base = this.config.headers;
        const resolved = typeof input === "function"
            ? input(header(base)).config
            : { ...base, ...input };

        return new Photon({ ...this.config, headers: resolved });
    }
    resetHeaders() {
        return new Photon({ ...this.config, headers: {} });
    }
    get(url?: string): PRequest {
        return this.#request("GET", url);
    }

    post(url?: string): PRequest {
        return this.#request("POST", url);
    }

    put(url?: string): PRequest {
        return this.#request("PUT", url);
    }

    patch(url?: string): PRequest {
        return this.#request("PATCH", url);
    }
    invalidate(key: CacheKey) {
        cache.invalidate(key);
        return this;
    }
    delete(url?: string): PRequest {
        return this.#request("DELETE", url);
    }
    dedupe(dedupe = true) {
        return new Photon({...this.config, dedupe });
    }
    retries(retries: number, statuses: Array<RetryStatus> =[]) {
        return new Photon({...this.config, retries, retryStatuses: statuses });
    }
    cache(ttl=60_000) {
        return new Photon({...this.config, ttl, cache: true });
    }
    intercept(input: (h: PInterceptor) => PInterceptor) {
        const base = input(pinterceptor());
        const resolved = deepCopy(this.config.interceptors, base.registry);
        return new Photon({...this.config, interceptors: resolved });
    }
    resetInterceptors() {
        return new Photon({...this.config, interceptors: {
            onRequest: [],
            onResponse: []
        } });
    }
    #request(method: Method, url?: string): PRequest {
        return request({
            ...this.config, 
            method: method, 
            url: url 
        });
    }
}
export function photon(config: PhotonConfig = { 
    cache: false, 
    dedupe: false, 
    retries: 0,
    interceptors: {
        onRequest: [],
        onResponse: []
    } 
}) {
    return new Photon(config);
};
