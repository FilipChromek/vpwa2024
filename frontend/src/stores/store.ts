import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Room } from 'components/models';

export const useChatStore = defineStore('chatStore', () => {
  const chatRooms = ref<Room[]>([
    {
      id: 1,
      name: 'Private Chat 1',
      type: 'private',
      messages: [
        {
          name: 'Me',
          text: ['Hey there!'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        },
        {
          name: 'Friend',
          text: ['Hello!'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: false,
        },
      ],
    },
    {
      id: 2,
      name: 'Private Chat 2',
      type: 'private',
      messages: [
        {
          name: 'Me',
          text: ['This is Private Chat 2.'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        },
        {
          name: 'Colleague',
          text: ['Nice to chat with you here.'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: false,
        },
      ],
    },
    {
      id: 3,
      name: 'Public Chat 1',
      type: 'public',
      messages: [
        {
          name: 'Me',
          text: ['Welcome to Public Chat 1!'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        },
        {
          name: 'Participant',
          text: ['Thanks!'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: false,
        },
      ],
    },
  ]);

  const addChatRoom = (
    roomName: string,
    type: 'private' | 'public' = 'private'
  ) => {
    const newRoom: Room = {
      id: chatRooms.value.length + 1,
      name: roomName,
      type,
      messages: [],
    };
    chatRooms.value.push(newRoom);
  };

  const removeChatRoom = (roomId: number) => {
    chatRooms.value = chatRooms.value.filter((room) => room.id !== roomId);
  }; // TODO tu este treba routing ak je tento chat momentalne na ChatPage

  return {
    chatRooms,
    addChatRoom,
    removeChatRoom,
  };
});
