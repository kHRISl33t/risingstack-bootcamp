'use strict'

const tableName = 'contribution'

function up(knex) {
  return knex.schema.createTable(tableName, (table) => {
    table.increments('user').notNull().primary()
      .references('id')
      .inTable('user')
      .onDelete('CASCADE')
    table.integer('repository').notNull().unique()
      .references('id')
      .inTable('repository')
      .onDelete('CASCADE')
    table.integer('line_count').notNull()
  })
}

function down(knex) {
  return knex.schema.dropTableIfExists(tableName)
}

module.exports = {
  up,
  down
}
