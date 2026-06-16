import { err, ok } from "./utils.ts";

export class PResponse<T> {
    #response: Response;
    constructor(response: Response) {
        this.#response = response;
    }
    static async resolve<T>(promise: Promise<Response>) {
        const response = await promise;
        return new PResponse<T>(response);
    }
    async text() {
        return this.#parse(() => this.#response.text());
    }
    async raw() {
        return this.#parse(() => Promise.resolve(this.#response));
    }
    async json() {
        return this.#parse<T>(() => this.#response.json());
    }
    async #parse<T>(data: () => Promise<T>) {
        if (this.#response.ok) {
            return ok({
                data: await data(),
                status: this.#response.status
            });
        }
        return this.#responseErr();
    }
    async #responseErr() {
        try {
            const error = await this.#response.json() as unknown;
            return err({ error, status: this.#response.status });
        } catch {
            return err({ error: this.#response.statusText, status: this.#response.status });
        }
    }
}
export const presponse = <T>(response: Response) => new PResponse<T>(response);