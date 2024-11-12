import type { WsContextContract } from '@ioc:Ruby184/Socket.IO/WsContext'
import Message from "App/Models/Message";

export default class ChatsController {
  public async loadMessages({ params, socket }: WsContextContract) {
    const messages = await Message.query().where('channelId', params.id).preload('author').orderBy('createdAt', 'asc');
    socket.emit('messagesLoaded', messages)
  }

public async addMessage({ params, socket, auth }: WsContextContract, content: string) {
    const channelId = parseInt(params.id);
    const message = await Message.create({
      content: content,
      channelId: channelId,
      createdBy: auth.user!.id,
    });

    socket.broadcast.to(`channels:${channelId}`).emit('message', message);
    return message;
  }
}
