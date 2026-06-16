class Dedupe {
    #inFlight: Map<string, Promise<Response>> = new Map();
    get(key: string) {
        return this.#inFlight.get(key);
    }

    set(key: string, promise: Promise<Response>): void {
        this.#inFlight.set(key, promise);
        return void promise.finally(() => this.#inFlight.delete(key));
    }

    clear(): void {
        this.#inFlight.clear();
    }
}

export const dedupe = new Dedupe();