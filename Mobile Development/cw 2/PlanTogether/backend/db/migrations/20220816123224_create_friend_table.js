/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("friends", function (table) {
    table.string("id", 32).notNullable().primary();
    table.string("from", 32).notNullable();
    table.string("to", 32).notNullable();
    table.string("status").notNullable();
    table.bigInteger("requestedDate").unsigned().notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
