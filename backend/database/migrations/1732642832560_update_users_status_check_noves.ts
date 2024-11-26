import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('status');
    });
    this.schema.alterTable(this.tableName, (table) => {
      table.enum('status', ['Online', 'Offline', 'DND','Away']).defaultTo('Offline');
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('status');
    });
  }
}
