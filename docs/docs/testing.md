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

## e2e Tests

End-to-end tests are performed using [Protractor][4]. 
Protractor is made for Angular but the adaption does not require too much effort.

To execute e2e tests these components are involved:
- A dev server to provide the runtime to test
- A selenium server
- The Protractor test suite
- A server to provide API responses

To run the tests these components concurrently with these commands:
```shell script
SERVER=[server] npm run start:e2e
npm run webdriver:start
npm run test:e2e
```

[1]: https://jestjs.io/
[2]: https://babeljs.io/
[3]: https://en.reactjs.org/docs/test-renderer.html
[4]: https://www.protractortest.org/
