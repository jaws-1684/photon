import type { Interceptor, RequestInterceptor, ResponseInterceptor } from "./types/types.index";
export class PInterceptor {
    registry: Interceptor = {
        onRequest: [],
        onResponse: []
    };
    request(fn: RequestInterceptor) {
        this.registry.onRequest.push(fn);
        return this;
    };
    response(fn: ResponseInterceptor) {
        this.registry.onResponse.push(fn);
        return this;
    }
};
export const pinterceptor = () => new PInterceptor;