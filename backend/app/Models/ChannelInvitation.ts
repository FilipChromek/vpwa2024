import { DateTime } from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import Channel from "App/Models/Channel";
import User from "App/Models/User";

export default class ChannelInvitation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public channelId: number

  @column()
  public invitedUserId: number

  @column()
  public invitedBy: number

  @column()
  public status: 'pending' | 'accepted' | 'declined';

  @belongsTo(() => Channel, {
    foreignKey: 'channelId',
  })
  public channel: BelongsTo<typeof Channel>

  @belongsTo(() => User, {
    foreignKey: 'invitedUserId',
  })
  public invitedUser: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'invitedBy',
  })
  public invitedByUser: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
