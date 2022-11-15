# Sps-services-test-automation

This repository is meant to act as the source of end-to-end and integration test that validates the behavior of a Spark Platform Services's. The tests are currently written in Node using Mocha as a test runner.

## Install Dependencies

```
npm install
```
Note: You need to have node version 16 installed on your local

## Creating test with Mocha and Chai
All tests for given service should be created and stored in a separate folder in the `tests` directory -example: `./tests/service-name`.

By default the test are executed in parallel mode using one node process per test suite. Parallel execution has a significant speed advantage, but also introduces some challenges:

- Each test needs to be isolated, to avoid failures caused by manipulating the same data.
- When running locally, the process load will probably cause performance failures.
 
Use the `describe` keyword to give structure to your test suite and `it` for test cases.  The full title of the test case is the concatenation of `describe` and `it` titles.

## How to run test

- `npm run test --env={env on which test will be run} --service=all` - executes all tests in tests directory
```
npm run test --env=qa --service=all
```
- `npm run test --env={env on which test will be run} --service={directory name in tests folder}` - executes all test in passed directory
```
npm run test --env=qa --service=placeholder-service1-tests
```
- `npm run test --env={env on which test will be run} --service={directory name in tests folder} file={file name}` - executes only test in passed file
```
npm run test --env=qa --service=placeholder-service1-tests --file=test_1.js
```

## Supported flags and params
- `--report` when passed generates mocha json report which can be used to report tets results on github action
- `--dtab ${val}` pass dtab header 
- `--region` region to run test on. example: us-east-1, us-west-2 as default us-west-2 is used
- `--tag` will execute only tagged test
- `--trProjectName` name of project on testrail where test results can be published
- `--trRunId` run id of created tets run in testrail 
- `--info` list all flags and usage

## Build-in tools

1. createClient - a request client, based on Axios and configured with sensible defaults for API testing.

```
const { createClient } = require('../../helpers');
const client = createClient({
  baseURL: 'http://localhost:3000/'
})

client.get('/status/200')
  .then(function ({ data }) {
    console.log('Received: %s', data)
  })
```

2. skipIf - skips the surrounding Suite (i.e. context or describe) if fn returns a truthy value.

```
const { skipIf } = require('../../extensions');

describe('Test name', function () {
  skipIf(() => return true) 

  it('will be skipped', function () {
    .....
  });   
})
```

3. waitFor - waits for fn to return with a truthy value before proceeding with tests, calling it periodically. By default no timeout is active. If provided, the title is used for the generated before clause.

```
const { waitFor } = require('../../extensions');

describe('Test name', function () {
  ...

  waitFor(async function () => {
    if (condition is true) {
      return true
    }

    return false
  }, { duration: 6000 }); 

  it('test to be executed if condition is true', function () {
    .....
  });   
})
```

4. tag - can be used to filter test cases. So that one can organize tests for particular purpose like smoke test or regression tests

```
describe.tag('@smoke')('Test name', function () {
  ...
});
```

## Testrail integration

The `--report` flag allows to publish test in testrail. To trigger this option you need to firstly create a `.env` file in root directory with following env variables

```
TESTRAIL_HOST=https://myfox.testrail.io
TESTRAIL_USER={your testrail user email}
TESTRAIL_APIKEY={generated apikey for testrail}
```
Then during test execution you need to pass `--trProjectName={testrail project name}`. This will create a new suite in given project which will include all executed test and results

## CI/CD integration
TODO