import {DateTime} from "luxon";
import Channel from "App/Models/Channel";
import Database from "@ioc:Adonis/Lucid/Database";
import {WsContextContract} from "@ioc:Ruby184/Socket.IO/WsContext";

export default class ChannelsController {
  public async loadChannels({ auth, socket }: WsContextContract) {
    try {
      const channels = await auth.user!.related('channels').query().orderBy('createdAt', 'desc')
      socket.emit('loadedChannels', channels);
    } catch (error) {
      socket.emit('error', 'Failed to load channels.')
    }
  }

  public async addChannel({ auth, socket }: WsContextContract, { name, isPrivate }: { name: string, isPrivate: boolean }) {
    try {
      const channel = await Channel.create({
        name,
        isPrivate,
        createdBy: auth.user!.id,
        lastActivity: DateTime.now(),
      })
      socket.emit('channelAdded', channel)
    } catch (error) {
      socket.emit('error', 'Failed to add channel.')
    }
  }

  public async removeChannel({ socket, auth }: WsContextContract, { channelId }: { channelId: number }) {
    console.log('channelId', channelId);
    const channel = await Channel.find(channelId);
    if (!channel) {
      return socket.emit('error', { message: 'Channel not found.' });
    }

    if (channel.createdBy === auth.user!.id) {
      console.log('Deleting channel:', channel.id);
      await channel.delete();
      socket.nsp.emit('channelDeleted', { channelId: channelId });
    } else {
      console.log('Leaving channel:', channel.id);
      await Database.from('channel_users').where('channel_id', channelId).where('user_id', auth.user!.id).delete();
      socket.emit('channelDeleted', { channelId: channelId });

      const updatedUsers = await Database.from('channel_users')
        .innerJoin('users', 'channel_users.user_id', 'users.id')
        .where('channel_users.channel_id', channelId)
        .select('users.id', 'users.first_name', 'users.last_name', 'users.username', 'users.status');

      socket.nsp.emit('channelUsers', { channelId: channelId, users: updatedUsers });
    }
  }

  public async findOrCreateChannel({ socket, auth }: WsContextContract, { name, isPrivate }: { name: string; isPrivate: boolean }) {
    try {
      let channel = await Channel.query().where('name', name).first()

      if (channel) {
        if (channel.isPrivate) {
          return socket.emit('error', { message: 'Channel is private' });
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

      const updatedUsers = await channel.related('users').query();

      socket.nsp.emit('channelUsers', { channelId: channel.id, users: updatedUsers });
      socket.emit('channelAdded', channel);
    } catch (error) {
      socket.emit('error', 'Failed to find or create channel.')
    }
  }
}
