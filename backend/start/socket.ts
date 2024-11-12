/*
|--------------------------------------------------------------------------
| Websocket events
|--------------------------------------------------------------------------
|
| This file is dedicated for defining websocket namespaces and event handlers.
|
*/

import Ws from '@ioc:Ruby184/Socket.IO/Ws'

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
  // .connected(({ socket, params }) => {
  //     console.log(`User connected to channel: ${params.id} with socket ID: ${socket.id}`);
  //   })
  .on("loadMessages", "ChatsController.loadMessages")
  .on("addMessage", "ChatsController.addMessage");
