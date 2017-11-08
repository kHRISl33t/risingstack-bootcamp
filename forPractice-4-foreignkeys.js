'use strict'

// not including the solution

function up(knex) {
  return Promise.all([knex.schema.table('user', (table) => {
    table.foreign('id').references('repository.id')
  }),
  knex.schema.table('contribution', (table) => {
    table.foreign('user').references('user.id')
  }),
  knex.schema.table('contribution', (table) => {
    table.foreign('repository').references('repository.id')
  })
  ])
}

function down(knex) {
  return Promise.all([
    knex.schema.table('user', (table) => {
      table.dropForeign('id')
    }),
    knex.schema.table('contribution', (table) => {
      table.dropForeign('user')
      table.dropForeign('repository')
    })
  ])
}

module.exports = {
  up,
  down
}
