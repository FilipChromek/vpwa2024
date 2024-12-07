import {DateTime} from "luxon";
import Channel from "App/Models/Channel";
import Database from "@ioc:Adonis/Lucid/Database";
import {WsContextContract} from "@ioc:Ruby184/Socket.IO/WsContext";
import ChannelInvitation from "App/Models/ChannelInvitation";

export default class ChannelsController {
  private getUserRoom(userId: number): string {
    return `user:${userId}`;
  }

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

  public async inviteUser({ auth, socket, bouncer }: WsContextContract, { channelId, username }: { channelId: number, username: string }) {
    const channel = await Channel.find(channelId);
    if (!channel) {
      return socket.emit('error', { message: 'Channel not found.' });
    }

    try {
      await bouncer.with('ChannelPolicy').authorize('isChannelAdmin', channel);
    } catch (e) {
      return socket.emit('error', { message: 'Unauthorized to invite users in this channel.' });
    }

    const user = await Database.from('users').where('username', username).first();
    if (!user) {
      return socket.emit('error', {message: 'User not found.'});
    }

    const existingInvitation = await ChannelInvitation.query()
      .where('channelId', channelId)
      .andWhere('invitedUserId', user.id)
      .andWhere('status', 'pending')
      .first();

    if (existingInvitation) {
      return socket.emit('error', { message: 'User already invited to this channel.' });
    }

    await ChannelInvitation.create({
      channelId: channelId,
      invitedUserId: user.id,
      invitedBy: auth.user!.id,
      status: 'pending',
    });

    const userRoom = this.getUserRoom(user.id);

    socket.to(userRoom).emit('invitationReceived', {
      channelId: channel.id,
      channelName: channel.name,
    });

    socket.emit('invitationSent');
  }

  public async revokeUser({ socket, bouncer }: WsContextContract, { channelId, username }: { channelId: number, username: string }) {
    const channel = await Channel.find(channelId);
    if (!channel) {
      return socket.emit('error', { message: 'Channel not found.' });
    }

    try {
      await bouncer.with('ChannelPolicy').authorize('isChannelAdmin', channel);
    } catch (e) {
      return socket.emit('error', { message: 'Unauthorized to revoke users in this channel.' });
    }

    const user = await Database.from('users').where('username', username).first();
    if (!user) {
      return socket.emit('error', {message: 'User not found.'});
    }

    await Database.from('channel_users')
      .where('channel_id', channelId)
      .where('user_id', user.id)
      .delete();

    const userRoom = this.getUserRoom(user.id);
    socket.to(userRoom).emit('revokeReceived', {
      channelId: channel.id,
      channelName: channel.name,
    });

    const updatedUsers = await Database.from('channel_users')
      .innerJoin('users', 'channel_users.user_id', 'users.id')
      .where('channel_users.channel_id', channelId)
      .select('users.id', 'users.first_name', 'users.last_name', 'users.username', 'users.status');

    socket.nsp.emit('channelUsers', {channelId: channelId, users: updatedUsers});
  }

  public async loadInvitations({ auth, socket }: WsContextContract) {
    try {
      const invitations = await auth.user!.related('invitations').query().where('status', 'pending').orderBy('createdAt', 'desc')
      socket.emit('loadedInvitations', invitations);
    } catch (error) {
      socket.emit('error', 'Failed to load invitations.')
    }
  }

  public async handleInvitation({ auth, socket }: WsContextContract, { invitationId, accept }: { invitationId: number, accept: boolean }) {
    const invitation = await auth.user!.related('invitations').query().where('id', invitationId).first()
    if (!invitation) {
      return socket.emit('error', 'Invitation not found.')
    }

    if (accept) {
      const channel = await invitation.related('channel').query().first()
      if (!channel) {
        return socket.emit('error', 'Channel not found.')
      }
      await channel.related('users').attach([auth.user!.id])
      invitation.status = 'accepted'
      await invitation.save()
      socket.emit('invitationAccepted', invitation)

      const updatedUsers = await Database.from('channel_users')
        .innerJoin('users', 'channel_users.user_id', 'users.id')
        .where('channel_users.channel_id', channel.id)
        .select('users.id', 'users.first_name', 'users.last_name', 'users.username', 'users.status');

      socket.nsp.emit('channelUsers', { channelId: channel.id, users: updatedUsers})
    } else {
      invitation.status = 'declined'
      await invitation.save()
      socket.emit('invitationDeclined', invitation)
    }
  }
}
