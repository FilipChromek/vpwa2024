import type { WsContextContract } from '@ioc:Ruby184/Socket.IO/WsContext'
import Message from "App/Models/Message";
import User from "App/Models/User";
import PushSubscription from "App/Models/PushSubscription";
import webPush from 'web-push';
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

    const taggedUsers = await User.query().whereIn('username', usernames);

    await message.related('tags').attach(taggedUsers.map(user => user.id));

    await message.load("tags");
    await message.load("author");

    socket.nsp.emit('message', message);

    const usersInChannel = await User.query()
      .whereHas('channels', (channelQuery) => {
        channelQuery.where('channels.id', channelId);
      });

    const userIdsToNotify = usersInChannel
      .filter((user) => user.id !== auth.user!.id) // Exclude the author of the message
      .map((user) => user.id);

    const subscriptions = await PushSubscription.query().whereIn('userId', userIdsToNotify);

    const vapidDetails = {
      subject: 'mailto:your-email@example.com',
      publicKey: process.env.VAPID_PUBLIC_KEY!,
      privateKey: process.env.VAPID_PRIVATE_KEY!,
    };

    webPush.setVapidDetails(vapidDetails.subject, vapidDetails.publicKey, vapidDetails.privateKey);

    for (const subscription of subscriptions) {
      const pushSubscription = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh,
          auth: subscription.auth,
        },
      };

      const payload = JSON.stringify({
        title: 'New Message',
        body: `${auth.user!.username}: ${content}`,
        url: `/channels/${channelId}`,
      });

      try {
        await webPush.sendNotification(pushSubscription, payload);
      } catch (error) {
        console.error('Failed to send push notification:', error);
      }
    }

    return message;
  }
  // function to show real time writing message
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
