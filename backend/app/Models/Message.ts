import { DateTime } from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column, ManyToMany, manyToMany} from "@ioc:Adonis/Lucid/Orm";
import User from 'App/Models/User'
import Channel from 'App/Models/Channel'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public createdBy: number

  @column()
  public channelId: number

  @column()
  public content: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'createdBy',
  })
  public author: BelongsTo<typeof User>

  @belongsTo(() => Channel, {
    foreignKey: 'channelId',
  })
  public channel: BelongsTo<typeof Channel>

  @manyToMany(() => User, {
    pivotTable: 'message_tags',
    pivotForeignKey: 'message_id',
    pivotRelatedForeignKey: 'user_id',
    pivotTimestamps: true,
  })
  public tags: ManyToMany<typeof User>
}
