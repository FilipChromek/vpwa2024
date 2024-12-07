import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, hasMany, HasMany, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import Channel from "App/Models/Channel";
import Message from "App/Models/Message";
import ChannelInvitation from "App/Models/ChannelInvitation";

export enum UserStatus {
  ONLINE = 'Online',
  OFFLINE = 'Offline',
  DND = 'DND',
  AWAY = 'Away'
}

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public firstName: string

  @column()
  public lastName: string

  @column()
  public username: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column({
    consume: (value: string) => value as UserStatus
  })
  public status: UserStatus

  @column()
  public notifications: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Channel, {
    foreignKey: 'createdBy',
  })
  public createdChannels: HasMany<typeof Channel>

  @hasMany(() => Message, {
    foreignKey: 'createdBy',
  })
  public messages: HasMany<typeof Message>

  @manyToMany(() => Channel, {
    pivotTable: 'channel_users',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'channel_id',
    pivotTimestamps: true,
  })
  public channels: ManyToMany<typeof Channel>

  @manyToMany(() => Message, {
    pivotTable: 'message_tags',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'message_id',
    pivotTimestamps: true,
  })
  public taggedMessages: ManyToMany<typeof Message>

  @hasMany(() => ChannelInvitation, {
    foreignKey: 'invitedUserId',
  })
  public invitations: HasMany<typeof ChannelInvitation>

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
