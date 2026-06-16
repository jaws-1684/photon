type PCacheEntry = {
    data: Response
    expires: number | undefined,
};
class Cache {
    #cache: Map<string, PCacheEntry> = new Map();
    get(key: string) {
        const entry = this.#cache.get(key);
        if (!entry) return undefined;
        if (entry.expires !== undefined && entry.expires < Date.now()) {
            this.#cache.delete(key);
            return undefined;
        }
        return entry.data;
    }

    set(key: string, data: Response, ttl?: number): void {
        this.#cache.set(key, {
            data,
            expires: ttl === undefined ? undefined : Date.now() + ttl,
        });
    }

    invalidate(key: string): void {
        this.#cache.delete(key);
    }

    clear(): void {
        this.#cache.clear();
    }
}
export const cache = new Cache();