// body.ts
import type { Content } from "./types/types.core.ts";

type BodyState = {
    data: BodyInit | undefined
    contentType: Content | undefined
};

export class PBody {
    #state: BodyState;

    constructor(state: BodyState = { data: undefined, contentType: undefined }) {
        this.#state = state;
    }

    json(data: unknown) {
        this.#state = {
            data: JSON.stringify(data),
            contentType: "application/json"
        };
        return this;
    }

    formData(data: FormData) {
        this.#state = { data, contentType: undefined };
        return this;
    }

    urlEncoded(data: URLSearchParams | Record<string, string>) {
        this.#state = {
            data: data instanceof URLSearchParams ? data : new URLSearchParams(data),
            contentType: undefined
        };
        return this;
    }

    blob(data: Blob) {
        this.#state = { data, contentType: undefined };
        return this;
    }

    text(data: string) {
        this.#state = { data, contentType: "text/plain" };
        return this;
    }

    raw(data: BodyInit) {
        this.#state = { data, contentType: undefined };
        return this;
    }
    get data() {
        return this.#state.data;
    }
    get headers() {
        return this.#state.contentType ? { "Content-Type": this.#state.contentType } : {};
    }
}

export const body = (state: BodyState = { data: undefined, contentType: undefined }) => new PBody(state);