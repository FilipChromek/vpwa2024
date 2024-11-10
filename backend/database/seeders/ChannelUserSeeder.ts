import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from "@ioc:Adonis/Lucid/Database";

export default class ChannelUserSeeder extends BaseSeeder {
  public async run () {
    const channels = await Database.from('channels').select('id')
    const userId = 1

    await Database.table('channel_users').multiInsert(
      channels.map(({id}) => ({
        user_id: userId,
        channel_id: id,
      }))
    )
  }
}
