import { photon } from "./index.ts";

const api = photon()
    .headers(h => h.accept("application/json"))
    .baseUrl("https://api.escuelajs.co/api/v1")
    .intercept(i => i.request(request => {
        console.log("[Fetching]: " + request.fullUrl);
        console.log("[Method]: " + request.init.method);
        return request;
    }))
    .cache();
   
for (let i = 0; i < 10; i++) {
    await api.invalidate("GET:Products")
        .post("/products")
        .body(b => b.json("payload") )
        .key("GET:Products")
        .json();
};        