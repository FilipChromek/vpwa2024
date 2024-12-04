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

Ws.namespace('/')
  .connected(({ socket }) => {
    console.log('new websocket connection: ', socket.id)
  })
  .disconnected(({ socket }, reason) => {
    console.log('websocket disconnecting: ', socket.id, reason)
  })
  .on('hello', ({ socket }, msg: string) => {
    console.log('websocket greeted: ', socket.id, msg)
    return 'hi'
  })

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
  .on("inviteUser", async ({ socket, params }, username) => {
    const user = await Database.from('users').where('username', username).first();
    if (!user) {
      socket.emit('inviteError', {message: 'User not found'});
      return;
    }

    await Database.table('channel_users').insert({
      channel_id: params.id,
      user_id: user.id,
    });

    const updatedUsers = await Database.from('channel_users')
      .innerJoin('users', 'channel_users.user_id', 'users.id')
      .where('channel_users.channel_id', params.id)
      .select('users.id', 'users.first_name', 'users.last_name', 'users.username', 'users.status');

    socket.nsp.emit('channelUsers', {channelId: params.id, users: updatedUsers});
  })
  .on("loadMessages", "ChatsController.loadMessages")
  .on("addMessage", "ChatsController.addMessage")
  .on("writingMessage", "ChatsController.writingMessage");
