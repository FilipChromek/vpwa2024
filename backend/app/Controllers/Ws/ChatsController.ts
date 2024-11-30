import type { WsContextContract } from '@ioc:Ruby184/Socket.IO/WsContext'
import Message from "App/Models/Message";
const writingUsers: Map<number,  Message[]> = new Map();

export default class ChatsController {
  public async loadMessages({ params, socket }: WsContextContract, from:number, to:number) {
    console.log('Before loading messages')
   
    const limit = to-from;
    console.log(from, to, limit)
    const messages = await Message.query()
      .where('channelId', params.id)
      .preload('author')
      .orderBy('createdAt', 'desc')
      .offset(from)
      .limit(limit);
     // console.log(messages)
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
  // function to show real time writting message
  public async writingMessage({ params, socket, auth }: WsContextContract, content: string) {
    
    const channelId = parseInt(params.id);
    
   
    const message = new Message();
    message.content = content;
    message.channelId = channelId;
    message.createdBy = auth.user!.id;
    console.log(message);
   
    await message.$setRelated('author', auth.user!);


    if (!writingUsers.has(channelId)) {
      writingUsers.set(channelId, []);
    }

    const channelMessages = writingUsers.get(channelId)!;

    const existingMessageIndex = channelMessages.findIndex((msg) => msg.createdBy === auth.user!.id);


    if (content.trim()) {
      if (existingMessageIndex !== -1) {
        
        channelMessages[existingMessageIndex].content = content;
      } else {
        
        channelMessages.push(message);
      }
    } else {
      
      if (existingMessageIndex !== -1) {
        channelMessages.splice(existingMessageIndex, 1);
      }
    }

    if (channelMessages.length === 0) {
      writingUsers.delete(channelId);
    }


   
    socket.nsp.emit('writing', channelMessages.map((msg) => ({
      content: msg.content,
      userId: msg.createdBy,
      author: msg.author,
      createdBy:msg.createdBy
    })));
    
  
   
    return message;
  }
  public isUserWriting(channelId: number, userId: number): boolean {
    const channelMessages = writingUsers.get(channelId);
    if (!channelMessages) return false;

    
    return channelMessages.some((msg) => msg.createdBy === userId);
  }
}
