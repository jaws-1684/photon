
## Description
Photon is a tiny fetch wrapper that supports request interception, caching, and deduplication. 
## Built With

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

---
## Features 
- Immutable
- Class based
- Request interception
- Caching
- Deduping

## Getting Started

### Prerequisites

Make sure you have Node.js and npm installed.

```sh
npm install npm@latest -g
```

### Installation

1. Clone the repository
   ```sh
   git clone https://github.com/jaws-1684/photon
.git
   ```
2. Navigate into the project directory
   ```sh
   cd photon

   ```
3. Install dependencies
   ```sh
   npm install
   ```
4. Build
```sh
npm run build
```   
5. Link the directory since the library in not published
 ```sh
cd ./project-dir
npm link ../photon
 ```

### Run tests
```sh
npm test
```
---
## Examples
``` javascript
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
```

## Contributing
If you have some *amazing* improvement ideas *feel free* to contribute.

1. Clone this repo
2. Create your Feature Branch (`git checkout -b feature/my_amazing_feature`)
3. Commit your Changes (`git commit -m 'Add some amazing_feature'`)
4. Push to the Branch (`git push origin feature/amazing_feature`)
5. Open a Pull Request


---

## License

Distributed under the ISC License. See `LICENSE` for more information.

---

## Contact

GitHub: [jaws-1684](https://github.com/jaws-1684)
Project Link: [https://github.com/jaws-1684/photon](https://github.com/jaws-1684/photon)


---
