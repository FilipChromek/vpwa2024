import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Message, Room } from 'components/models';

export const useChatStore = defineStore('chatStore', () => {
  const messages = ref<Message[]>([]);
  const new_messages = ref<Message[]>([]);
  const chatRooms = ref<Room[]>([
    {
      id: 1,
      name: 'Private Chat 1',
      type: 'private',
      messages: [
       
      ],
    },
    {
      id: 2,
      name: 'Private Chat 2',
      type: 'private',
      messages: [
        
      ],
    },
    {
      id: 3,
      name: 'Public Chat 1',
      type: 'public',
      messages: [
       
      ],
    },
  ]);
  const database = ref<Room[]>([
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
        },{
          name: 'Me',
          text: ['Hey there!19'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        },{
          name: 'Me',
          text: ['Hey there!18'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        },{
          name: 'Me',
          text: ['Hey there!17'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        },{
          name: 'Me',
          text: ['Hey there!16'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        },{
          name: 'Me',
          text: ['Hey there!15'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        },{
          name: 'Me',
          text: ['Hey there!14'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        },{
          name: 'Me',
          text: ['Hey there!13'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        },{
          name: 'Me',
          text: ['Hey there!12'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        },{
          name: 'Me',
          text: ['Hey there!11'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        },{
          name: 'Me',
          text: ['Hey there!'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        },{
          name: 'Me',
          text: ['Hey there!10'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        },{
          name: 'Me',
          text: ['Hey there!9'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        },{
          name: 'Me',
          text: ['Hey there!8'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        },{
          name: 'Me',
          text: ['Hey there!7'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        },{
          name: 'Me',
          text: ['Hey there!6'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        },{
          name: 'Me',
          text: ['Hey there!5'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        },{
          name: 'Me',
          text: ['Hey there!4'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        },{
          name: 'Me',
          text: ['Hey there!3'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        },{
          name: 'Me',
          text: ['Hey there!2'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        },{
          name: 'Me',
          text: ['Hey there!1'],
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          isSent: true,
        }
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
  const send_message = (message:Message,room_id:number) => {
    const database_data = database.value.find((room) => room.id === room_id);
    database_data?.messages.push(message);
    messages.value.push(message);
    //new_messages.value.push(message);
// Reassign the array to trigger reactivity
new_messages.value = [message];
    //console.log(message);
  }
  const reset_messages = () =>{
    messages.value = [];
    new_messages.value = [];
  }
  const getMessages = (roomId: number, offset: number, limit: number) => {
    
    const database_data = database.value.find((room) => room.id === roomId);
    console.log(database_data);
    if (database_data) {
        // Reverse the messages to load the latest ones first
         const newMessages = database_data.messages.slice().reverse().slice(offset, offset + limit).reverse();
      messages.value = [...newMessages, ...messages.value];
      return newMessages;
    }
    return [];
  };

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
    database.value.push(newRoom);
  };

  const removeChatRoom = (roomId: number) => {
    chatRooms.value = chatRooms.value.filter((room) => room.id !== roomId);
  }; // TODO tu este treba routing ak je tento chat momentalne na ChatPage

  return {
    chatRooms,
    addChatRoom,
    removeChatRoom,
    getMessages,
    send_message,
    messages,
    reset_messages,
    new_messages,
  };
});
