'use strict'

// repository.owner / user.id
// 

const tableName = 'repository'

function up(knex) {
  return knex.schema.createTable(tableName, (table) => {
    table.increments('id')
      .notNull()
      .primary()
    table.integer('owner')
      .references('id')
      .inTable('user')
      .onDelete('CASCADE')
    table.string('full_name', 255)
    table.string('description', 255)
    table.string('html_url', 255)
    table.string('language', 255)
    table.integer('stargazers_count').notNull()
  })
}

function down(knex) {
  return knex.schema.dropTableIfExists(tableName)
}

module.exports = {
  up,
  down
}
