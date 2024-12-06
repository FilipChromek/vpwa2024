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

Ws.namespace('/a')
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
  .on('changeStatus', 'UserStatusController.changeStatus');

Ws.namespace("/channels/:id")
  //.middleware('auth') // check if user can join given channel
  .connected(async ({ socket, params }) => {
      console.log(`User connected to channel: ${params.id} with socket ID: ${socket.id}`);

      const usersInChannel = await Database.from('channel_users')
        .innerJoin('users', 'channel_users.user_id', 'users.id')
        .where('channel_users.channel_id', params.id)
        .select('users.id', 'users.first_name', 'users.last_name', 'users.username', 'users.status');
      // TODO this is weird, change it to users.firstName and users.lastName if possible
      console.log('Users in channel: ', usersInChannel);
      socket.emit('channelUsers', { channelId: params.id, users: usersInChannel });
      })
  .on("loadMessages", "ChatsController.loadMessages")
  .on("inviteUser", "ChatsController.inviteUser")
  .on("revokeUser", "ChatsController.revokeUser")
  .on("addMessage", "ChatsController.addMessage")
  .on("writingMessage", "ChatsController.writingMessage");
