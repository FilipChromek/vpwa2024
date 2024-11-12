import type { WsContextContract } from '@ioc:Ruby184/Socket.IO/WsContext'
import Message from "App/Models/Message";

export default class ChatsController {
  public async loadMessages({ params, socket }: WsContextContract) {
    console.log('Before loading messages')
    const messages = await Message.query().where('channelId', params.id).preload('author').orderBy('createdAt', 'asc');
    console.log('After loading messages')
    socket.emit('messagesLoaded', messages)
  }

public async addMessage({ params, socket, auth }: WsContextContract, content: string) {
    const channelId = parseInt(params.id);
    const message = await Message.create({
      content: content,
      channelId: channelId,
      createdBy: auth.user!.id,
    });

    // Load the author relationship from ORM model DONT FORGET ABOUT THIS
    await message.load("author")

    socket.nsp.emit('message', message);
    return message;
  }
}
