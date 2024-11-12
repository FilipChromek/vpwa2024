import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from "@ioc:Adonis/Lucid/Database";

export default class ChannelUserSeeder extends BaseSeeder {
  public async run() {
    const channels = await Database.from('channels').select('id')
    const userIds = [1, 2]

    const channelUserRecords = userIds.flatMap((userId) =>
      channels.map(({ id: channelId }) => ({
        user_id: userId,
        channel_id: channelId,
      }))
    )

    await Database.table('channel_users').multiInsert(channelUserRecords)
  }
}
