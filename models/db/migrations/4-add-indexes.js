'use strict'

function up(knex) {
  return Promise.all([
    knex.schema.alterTable('user', (table) => {
      table.index('login')
    }),
    knex.schema.alterTable('repository', (table) => {
      table.index('full_name')
    })
  ])
}

function down(knex) {
  return Promise.all([
    knex.schema.table('user', (table) => {
      table.dropIndex('login')
    }),
    knex.schema.table('repository', (table) => {
      table.dropIndex('full_name')
    })
  ])
}

module.exports = {
  up,
  down
}
