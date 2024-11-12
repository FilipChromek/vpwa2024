import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import {DateTime} from "luxon";
import Channel from "App/Models/Channel";
import Database from "@ioc:Adonis/Lucid/Database";
import User from "App/Models/User";

export default class ChannelsController {
  public async index({ auth, response }: HttpContextContract) {
    try {
      const user = auth.user
      console.log('Before channels')
      const channels = await user?.related('channels').query()
      console.log('After channels')
      return response.ok(channels)
    } catch (error) {
      return response.badRequest({error: error.message})
    }
  }

  public async store({ auth, request, response }: HttpContextContract) {
    try {
      const user = auth.user
      const { name, isPrivate } = request.body()
      const channel = await Channel.create({
        name,
        isPrivate,
        createdBy: user?.id,
        lastActivity: DateTime.now(),
      })
      await channel.related('users').attach([user!.id])

      return response.created(channel)
    } catch (error) {
      return response.badRequest({error: error.message})
    }
  }

  public async destroy({ auth, params, response }: HttpContextContract) {
    const channel = await Channel.findOrFail(params.id)

    if (channel.createdBy !== auth.user?.id) {
      return response.unauthorized({error: 'You cannot delete this channel'})
    }

    await channel.delete()
    return response.ok({message: 'Channel deleted'})
  }

  public async removeUser({ auth, params, response }: HttpContextContract) {
    await Database.from('channel_users').where('channel_id', params.id).where('user_id', auth.user?.id).delete()
    return response.ok({message: 'User removed from channel'})
  }

  public async inviteUser({ auth, params, request, response }: HttpContextContract) {
    const channel = await Channel.findOrFail(params.id)

    if (channel.createdBy !== auth.user?.id) {
      return response.unauthorized({ message: 'Only the channel admin can invite users' })
    }

    const { username } = request.only(['username'])
    const user = await User.findByOrFail('username', username)

    await channel.related('users').attach([user.id])
    return response.ok({ message: 'User invited to channel' })
  }

  public async revokeUser({ auth, params, request, response }: HttpContextContract) {
    const channel = await Channel.findOrFail(params.id)

    if (channel.createdBy !== auth.user?.id) {
      return response.unauthorized({ message: 'Only the channel admin can revoke users' })
    }

    const { username } = request.only(['username'])
    const user = await User.findByOrFail('username', username)

    await channel.related('users').detach([user.id])
    return response.ok({ message: 'User revoked from channel' })
  }

  public async listChannelUsers({ params, response }: HttpContextContract) {
    const channel = await Channel.findOrFail(params.id)
    const users = await channel.related('users').query()
    return response.ok(users)
  }

  public async findOrCreate({ auth, request, response }: HttpContextContract) {
    const { name, isPrivate } = request.only(['name', 'isPrivate'])
    let channel = await Channel.query().where('name', name).first()

    if (channel) {
      if (channel.isPrivate) {
        return response.unauthorized({ message: 'Channel is private' })
      }
      await channel.related('users').attach([auth.user!.id])
    } else {
      channel = await Channel.create({
        name,
        isPrivate,
        createdBy: auth.user!.id,
        lastActivity: DateTime.now(),
      })
      await channel.related('users').attach([auth.user!.id])
    }

    return response.ok(channel)
  }
}
