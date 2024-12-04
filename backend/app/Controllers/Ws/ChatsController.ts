import type { WsContextContract } from '@ioc:Ruby184/Socket.IO/WsContext'
import Message from "App/Models/Message";
import User from "App/Models/User";
import Database from "@ioc:Adonis/Lucid/Database";
const writingUsers: Map<number,  Message[]> = new Map();

export default class ChatsController {
  public async loadMessages({ params, socket }: WsContextContract, from: number, to: number, channel_id: number) {
    console.log('Before loading messages')

    const limit = to-from;
    console.log(from, to, limit)
    const messages = await Message.query()
      .where('channelId', params.id)
      .preload('author')
      .preload('tags')
      .orderBy('createdAt', 'desc')
      .offset(from)
      .limit(limit);
     // console.log(messages)
    console.log('After loading messages')
    socket.emit('messagesLoaded', messages, channel_id)
  }

  public async addMessage({ params, socket, auth }: WsContextContract, content: string) {
    const channelId = parseInt(params.id);

    const message = await Message.create({
      content: content,
      channelId: channelId,
      createdBy: auth.user!.id,
    });

    const tags = content.match(/@\w+/g) || [];
    const usernames = tags.map((tag) => tag.slice(1));

    const users = await User.query().whereIn('username', usernames);

    await message.related('tags').attach(users.map(user => user.id));

    await message.load("tags");
    // Load the author relationship from ORM model DONT FORGET ABOUT THIS
    await message.load("author");

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

  public async inviteUser({ params, socket }: WsContextContract, username: string) {
    const user = await Database.from('users').where('username', username).first();
    if (!user) {
      // socket.emit('inviteError', {message: 'User not found'});
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
  }

  public async revokeUser({ params, socket }: WsContextContract, username: string) {
    const user = await Database.from('users').where('username', username).first();
    if (!user) {
      // socket.emit('revokeError', {message: 'User not found'});
      return;
    }

    await Database.from('channel_users')
      .where('channel_id', params.id)
      .where('user_id', user.id)
      .delete();

    const updatedUsers = await Database.from('channel_users')
      .innerJoin('users', 'channel_users.user_id', 'users.id')
      .where('channel_users.channel_id', params.id)
      .select('users.id', 'users.first_name', 'users.last_name', 'users.username', 'users.status');

    socket.nsp.emit('channelUsers', {channelId: params.id, users: updatedUsers});
  }
}
