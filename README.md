# fixture

A sample test fixture manager.

```
fixtures
└── hello
    └── hello.md
```

```javascript
import { FixtureManager } from "fixture-manager";

const fixtures = new FixtureManager({ path: "fixtures" });
const first = await fixtures.get("hello");
first.readFile("hello.md"); // Hello World
```
