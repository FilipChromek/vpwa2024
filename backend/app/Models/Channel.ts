import { DateTime } from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany, ManyToMany, manyToMany} from "@ioc:Adonis/Lucid/Orm";
import Message from "App/Models/Message";
import User from "App/Models/User";
import ChannelInvitation from "App/Models/ChannelInvitation";

export default class Channel extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public createdBy: number

  @column()
  public isPrivate: boolean

  @column.dateTime()
  public lastActivity: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'createdBy',
  })
  public creator: BelongsTo<typeof User>

  @hasMany(() => Message, {
    foreignKey: 'channelId',
  })
  public messages: HasMany<typeof Message>;

  @manyToMany(() => User, {
    pivotTable: 'channel_users',
    pivotForeignKey: 'channel_id',
    pivotRelatedForeignKey: 'user_id',
    pivotTimestamps: true,
  })
  public users: ManyToMany<typeof User>

  @hasMany(() => ChannelInvitation, {
    foreignKey: 'channelId',
  })
  public invitations: HasMany<typeof ChannelInvitation>
}
