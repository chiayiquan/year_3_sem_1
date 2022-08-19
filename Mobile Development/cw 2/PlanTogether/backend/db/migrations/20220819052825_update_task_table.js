/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.alterTable("tasks", function (table) {
    table.renameColumn("datetime", "datetimeStart");
    table.bigInteger("datetimeEnd").unsigned().notNullable();
  });
  return knex.schema.alterTable("participants", function (table) {
    table.boolean("readNotification").notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
