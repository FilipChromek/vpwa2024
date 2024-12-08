/*
|--------------------------------------------------------------------------
| Websocket events
|--------------------------------------------------------------------------
|
| This file is dedicated for defining websocket namespaces and event handlers.
|
*/

import Ws from '@ioc:Ruby184/Socket.IO/Ws'
import Database from "@ioc:Adonis/Lucid/Database";

Ws.namespace('/auth')
  .connected(({ socket, auth }) => {
    console.log('new websocket connection: ', socket.id)

    const usedId = auth.user?.id;

    if (usedId) {
      console.log('User connected with ID: ', usedId);
      socket.nsp.emit('userStatusUpdate', {userId: usedId, status: 'Online'});
    }
  })
  .disconnected(({ socket , auth}, reason) => {
    console.log('websocket disconnecting: ', socket.id, reason)
    const usedId = auth.user?.id;

    if (usedId) {
      console.log('User disconnected with ID: ', usedId);
      socket.nsp.emit('userStatusUpdate', {userId: usedId, status: 'Offline'});
    }
  })
  .on("changeStatus", "UserStatusController.changeStatus");

Ws.namespace("/channels/:id")
  //.middleware('auth') // check if user can join given channel
  .connected(async ({ auth, socket, params }) => {
      const isBanned = await Database.from('banned_users')
        .where('channel_id', params.id)
        .where('user_id', auth.user!.id)
        .first();

      if (isBanned) {
        socket.emit('error', { message: 'You are banned from this channel.' });
        socket.disconnect(true);
        return console.log(`User ${auth.user!.id} is banned from channel ${params.id}`);
      }

      console.log(`User connected to channel: ${params.id} with socket ID: ${socket.id}`);

      const usersInChannel = await Database.from('channel_users')
        .innerJoin('users', 'channel_users.user_id', 'users.id')
        .where('channel_users.channel_id', params.id)
        .select('users.id', 'users.first_name', 'users.last_name', 'users.username', 'users.status');

      console.log('Users in channel: ', usersInChannel);
      socket.emit('channelUsers', { channelId: params.id, users: usersInChannel });
      })
  .on("loadMessages", "ChatsController.loadMessages")
  .on("addMessage", "ChatsController.addMessage")
  .on("writingMessage", "ChatsController.writingMessage");

Ws.namespace("/channels")
  .connected(async ({ socket, auth }) => {
    const userRoom = `user:${auth.user!.id}`;

    // Join user-specific room
    socket.join(userRoom);

    // Add user ID to socket data for fetching online users
    socket.data.userId = auth.user!.id;
  })
  .disconnected(async ({ socket, auth }) => {
    const userRoom = `user:${auth.user!.id}`;

    // Leave user-specific room
    socket.leave(userRoom);
  })
  .on("loadChannels", "ChannelsController.loadChannels")
  .on("addChannel", "ChannelsController.addChannel")
  .on("removeChannel", "ChannelsController.removeChannel")
  .on("findOrCreateChannel", "ChannelsController.findOrCreateChannel")
  .on("loadInvitations", "ChannelsController.loadInvitations")
  .on("handleInvitation", "ChannelsController.handleInvitation")
  .on("inviteUser", "ChannelsController.inviteUser")
  .on("revokeUser", "ChannelsController.revokeUser")
  .on("kickUser", "ChannelsController.kickUser");
