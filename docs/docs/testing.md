---
title: Testing
---

Testing is performed using [Jest][1] configured with [Babel][2] and [react-test-render][3].

## Run unit tests
To run unit tests, run the command:
```bash
npm run test
```

### Update snapshots
To update the snapshots of the tests run this command:
```bash
npm run test -- -u
```

[1]: https://jestjs.io/
[2]: https://babeljs.io/
[2]: https://en.reactjs.org/docs/test-renderer.html
