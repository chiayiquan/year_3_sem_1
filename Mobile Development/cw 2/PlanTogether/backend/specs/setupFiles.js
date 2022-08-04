// For Jest test suites to run in parallel,
// We mutate process.env.DB_NAME to a test database based on JEST_WORKER_ID
// This needs to be set in Jest config > setupFiles
//
// JEST_ISOLATED_DATABASE is a global defined in the testEnvironment.js
process.env.DB_NAME = JEST_ISOLATED_DATABASE
