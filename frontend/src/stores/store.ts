import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Message, Room, User } from 'components/models';
import { Router } from 'vue-router';

export const useChatStore = defineStore('chatStore', () => {
  const newMessageFlag = ref(false);

  const chatRooms = ref<Room[]>([
    {
      id: 1,
      name: 'Private Chat 1',
      type: 'private',
      messages: [
        {
          name: 'Me',
          text: ['Hey there!41'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        },
        {
          name: 'Friend',
          text: ['Hello!40'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: false,
        },
        {
          name: 'Friend',
          text: ['Hello!39'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: false,
        },
        {
          name: 'Friend',
          text: ['Hello!38'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: false,
        },
        {
          name: 'Friend',
          text: ['Hello!37'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: false,
        },
        {
          name: 'Friend',
          text: ['Hello!36'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: false,
        },
        {
          name: 'Friend',
          text: ['Hello!35'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: false,
        },
        {
          name: 'Friend',
          text: ['Hello!34'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: false,
        },
        {
          name: 'Friend',
          text: ['Hello!33'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: false,
        },
        {
          name: 'Friend',
          text: ['Hello!32'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: false,
        },
        {
          name: 'Friend',
          text: ['Hello!31'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: false,
        },
        {
          name: 'Friend',
          text: ['Hello!30'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: false,
        },
        {
          name: 'Friend',
          text: ['Hello!29'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: false,
        },
        {
          name: 'Friend',
          text: ['Hello!28'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: false,
        },
        {
          name: 'Friend',
          text: ['Hello!27'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: false,
        },
        {
          name: 'Friend',
          text: ['Hello!26'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: false,
        },
        {
          name: 'Friend',
          text: ['Hello!25'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: false,
        },
        {
          name: 'Friend',
          text: ['Hello!24'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: false,
        },
        {
          name: 'Friend',
          text: ['Hello!23'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: false,
        },
        {
          name: 'Friend',
          text: ['Hello!22'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: false,
        },
        {
          name: 'Friend',
          text: ['Hello!21'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: false,
        },
        {
          name: 'Me',
          text: ['Hey there!20'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        },
        {
          name: 'Me',
          text: ['Hey there!19'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        },
        {
          name: 'Me',
          text: ['Hey there!18'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        },
        {
          name: 'Me',
          text: ['Hey there!17'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        },
        {
          name: 'Me',
          text: ['Hey there!16'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        },
        {
          name: 'Me',
          text: ['Hey there!15'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        },
        {
          name: 'Me',
          text: ['Hey there!14'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        },
        {
          name: 'Me',
          text: ['Hey there!13'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        },
        {
          name: 'Me',
          text: ['Hey there!12'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        },
        {
          name: 'Me',
          text: ['Hey there!11'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        },
        {
          name: 'Me',
          text: ['Hey there!'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        },
        {
          name: 'Me',
          text: ['Hey there!10'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        },
        {
          name: 'Me',
          text: ['Hey there!9'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        },
        {
          name: 'Me',
          text: ['Hey there!8'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        },
        {
          name: 'Me',
          text: ['Hey there!7'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        },
        {
          name: 'Me',
          text: ['Hey there!6'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        },
        {
          name: 'Me',
          text: ['Hey there!5'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        },
        {
          name: 'Me',
          text: ['Hey there!4'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        },
        {
          name: 'Me',
          text: ['Hey there!3'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        },
        {
          name: 'Me',
          text: ['Hey there!2'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        },
        {
          name: 'Me',
          text: ['Hey there!1'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
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

  const pendingRooms = ref<Room[]>([
    {
      id: 4,
      name: 'Unknown Chat ',
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
  ]);

  const people = ref<User[]>([
    { id: 1, name: 'Adam Kačmár', nickname: 'adamkatchee' },
    { id: 2, name: 'Filip Chromek', nickname: 'filipchromek11' },
    { id: 3, name: 'Ľubomír Tkač', nickname: 'pocerpadlo' },
    { id: 4, name: 'Július Pénzeš', nickname: 'trenerrumunska' },
  ]);

  const sendMessage = (message: string, room_id: number) => {
    const selectedChatRoom = chatRooms.value.find(
      (room) => room.id === room_id
    );
    if (selectedChatRoom) {
      const newMessage: Message = {
        name: 'Me',
        text: [message],
        avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
        isSent: true,
      };
      selectedChatRoom.messages.push(newMessage);
      newMessageFlag.value = true;
    } else {
      console.error('Room with this id not found.');
    }
  };

  const addChatRoom = (
    roomName: string,
    type: 'private' | 'public' = 'private',
    router: Router
  ) => {
    const newRoom: Room = {
      id: chatRooms.value.length + 1,
      name: roomName,
      type,
      messages: [],
    };

    chatRooms.value.push(newRoom);

    router.push({
      path: `/chat/${newRoom.id}`,
    });
  };

  const removeChatRoom = (roomId: number, router: Router) => {
    chatRooms.value = chatRooms.value.filter((room) => room.id !== roomId);
    const currentRoomId = parseInt(
      router.currentRoute.value.params.id as string,
      10
    );
    if (currentRoomId === roomId) {
      router.push({ path: '/' });
    }
  };

  const removePendingChatRoom = (roomId: number, router: Router) => {
    pendingRooms.value = pendingRooms.value.filter(
      (room) => room.id !== roomId
    );
    const currentRoomId = parseInt(
      router.currentRoute.value.params.id as string,
      10
    );
    if (currentRoomId === roomId) {
      router.push({ path: '/' });
    }
  };

  const lazyLoadMessages = (roomId: number) => {
    const offset = 10;
    const selectedChatRoom = chatRooms.value.find((room) => room.id === roomId);
    if (selectedChatRoom) {
      const numberOfMessages = selectedChatRoom.messages.length;
      for (let i = numberOfMessages; i < numberOfMessages + offset; i++) {
        const newMessage: Message = {
          name: 'Me',
          text: [`Hey there! ${i}`],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        };
        selectedChatRoom.messages = [newMessage, ...selectedChatRoom.messages];
      }
    }
    newMessageFlag.value = false;
  };

  return {
    chatRooms,
    pendingRooms,
    people,
    newMessageFlag,
    addChatRoom,
    removeChatRoom,
    removePendingChatRoom,
    sendMessage,
    lazyLoadMessages,
  };
});
