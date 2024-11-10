import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ChannelFactory from "Database/factories/ChannelFactory";

export default class ChannelSeeder extends BaseSeeder {
  public async run () {
    await ChannelFactory.createMany(10)
  }
}
