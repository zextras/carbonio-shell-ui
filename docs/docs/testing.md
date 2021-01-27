---
title: Testing
---

## Unit Tests

Unit tests are performed using [Jest][1] configured with [Babel][2] and [react-test-render][3]

To run unit tests, run the command:
```shell script
npm run test
```

### Update snapshots
To update the snapshots of the tests run this command:
```shell script
npm run test -- -u
```

### Mock network calls

To mock network calls, please refer to the examples inside `src/mockes` folder.

[1]: https://jestjs.io/
[2]: https://babeljs.io/
[3]: https://en.reactjs.org/docs/test-renderer.html
[4]: https://www.protractortest.org/
[5]: #mock-network-calls
