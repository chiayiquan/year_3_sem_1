/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("tasks", function (table) {
    table.string("id", 32).notNullable().primary();
    table.string("name").notNullable();
    table.bigInteger("datetime").unsigned().notNullable();
    table.string("location").nullable();
    table.string("description").nullable();
    table.string("status").notNullable();
    table.string("createdBy").notNullable();
    table.bigInteger("createdAt").unsigned().notNullable();
  });
  return knex.schema.createTable("participants", function (table) {
    table.string("id", 32).notNullable().primary();
    table.string("taskId", 32).notNullable();
    table.string("userId", 32).notNullable();
    table.string("status").notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
