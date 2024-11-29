import type { WsContextContract } from '@ioc:Ruby184/Socket.IO/WsContext'
import Message from "App/Models/Message";
const writingUsers: Map<number,  Message[]> = new Map();

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
  public async writingMessage({ params, socket, auth }: WsContextContract, content: string) {
    
    const channelId = parseInt(params.id);
    
    // Create a new instance of the Message model without saving it to the database
    const message = new Message();
    message.content = content;
    message.channelId = channelId;
    message.createdBy = auth.user!.id;
    console.log(message);
    // Temporarily load the author relationship for the message
    await message.$setRelated('author', auth.user!);


    if (!writingUsers.has(channelId)) {
      writingUsers.set(channelId, []);
    }

    const channelMessages = writingUsers.get(channelId)!;

    const existingMessageIndex = channelMessages.findIndex((msg) => msg.createdBy === auth.user!.id);


    if (content.trim()) {
      if (existingMessageIndex !== -1) {
        // Update the existing message
        channelMessages[existingMessageIndex].content = content;
      } else {
        // Add a new message
        channelMessages.push(message);
      }
    } else {
      // Remove the user's message if content is empty
      if (existingMessageIndex !== -1) {
        channelMessages.splice(existingMessageIndex, 1);
      }
    }

    if (channelMessages.length === 0) {
      writingUsers.delete(channelId);
    }


    // Emit the event to all connected sockets in the namespace
    socket.nsp.emit('writing', channelMessages.map((msg) => ({
      content: msg.content,
      userId: msg.createdBy,
      author: msg.author,
      createdBy:msg.createdBy
    })));
    
  
    // Return the unsaved message
    return message;
  }
  public isUserWriting(channelId: number, userId: number): boolean {
    const channelMessages = writingUsers.get(channelId);
    if (!channelMessages) return false;

    // Check if there's a message written by the user in this channel
    return channelMessages.some((msg) => msg.createdBy === userId);
  }
}
