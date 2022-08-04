// my-custom-environment
const NodeEnvironment = require("jest-environment-node").default;
const knex = require("knex");
const knexConfig = require("../db/knexfile");
const { database } = knexConfig.connection;

class TestEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
    this.isolatedDatabase = database + "-" + process.env.JEST_WORKER_ID;
    this.testDB = knex({
      ...knexConfig,
      connection: { ...knexConfig.connection, database: "postgres" },
    });

    // Set this global for setupFiles.js to set process.env.DB_NAME
    // because we can't set the process.env here
    this.global.JEST_ISOLATED_DATABASE = this.isolatedDatabase;
  }

  async setup() {
    await super.setup();
    await createIsolatedDatabase(this.isolatedDatabase, database, this.testDB);
  }

  async teardown() {
    await this.testDB.raw("DROP DATABASE IF EXISTS ??", [
      this.isolatedDatabase,
    ]);
    await this.testDB.destroy();
    await super.teardown();
  }
}

async function createIsolatedDatabase(isolatedDatabase, templateDatabase, db) {
  await db
    .raw("DROP DATABASE IF EXISTS ??", [isolatedDatabase])
    .then(async () =>
      db.raw("CREATE DATABASE ?? TEMPLATE ??", [
        isolatedDatabase,
        templateDatabase,
      ])
    );
}

module.exports = TestEnvironment;
