import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'channel_invitations'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('channel_id').unsigned().notNullable().references('id').inTable('channels').onDelete('CASCADE')
      table.integer('invited_user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.integer('invited_by').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.enum('status', ['pending', 'accepted', 'declined']).defaultTo('pending')
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
