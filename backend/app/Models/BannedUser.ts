import { DateTime } from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import User from "App/Models/User";
import Channel from "App/Models/Channel";

export default class BannedUser extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public channelId: number;

  @column()
  public userId: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Channel)
  public channel: BelongsTo<typeof Channel>;

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;
}
