import type { Accept, Authorization, Content, RawHeaders } from "./types/types.core.ts";

export class PHeader {
    config: RawHeaders;

    constructor(config: RawHeaders = {}) {
        this.config = config;
    }

    authorization(kind: Authorization): PHeader {
        this.config = { ...this.config, "Authorization": kind };
        return this;
    }

    content(kind: Content): PHeader {
        this.config = { ...this.config, "Content-Type": kind };
        return this;
    }

    accept(kind: Accept): PHeader {
        this.config = { ...this.config, "Accept": kind };
        return this;
    }

    xCSRFToken(kind: string): PHeader {
        this.config = { ...this.config, "X-CSRF-Token": kind };
        return this;
    }

    set(key: string, value: string): PHeader {
        this.config = { ...this.config, [key]: value };
        return this;
    }
}

export const header = (config: RawHeaders = {}) => new PHeader(config);