<template>
    <div class="q-pa-md chat-wrapper" >
      <q-infinite-scroll @load="onLoad" reverse>
        <template v-slot:loading>
          <div class="row justify-center q-my-md"> 
            <q-spinner color="primary" name="dots" size="40px" />
          </div>
        </template>
        <div ref="messageContainer" class="message-container">
        <q-chat-message
        v-for="(message, index) in items"
        :key="index"
        :name="message.name"
        :text="message.text"
        :avatar="message.avatar"
        :sent="message.isSent"
        />
    </div>
      </q-infinite-scroll>
     
    </div>
  </template>
  
  <script lang="ts">
  import { ref,computed,watch,onMounted } from 'vue'
  import { useRoute } from 'vue-router';
import { useChatStore } from 'stores/store';
import { Message} from 'components/models';
  export default {
    setup () {
      const items = ref<Message[]>([]);
      const chatStore = useChatStore();
        const route = useRoute();
        const chatRoomId = computed(() => parseInt(route.params.id as string, 10));
        const hasMore = ref(true);
        const currentOffset = ref(0);
        const loadLimit = ref (10);
        const messageContainer = ref<HTMLElement | null>(null);

        const scroll_dole = () => {
            setTimeout(()=>window.scrollTo({ top: document.body.scrollHeight}),0);
            
        }
        
      const onLoad = (index: number, done: () => void) => {
        //window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      if (!hasMore.value) {
        done();
        return;
      }

      // Synchronous fetching of messages
      const newMessages = chatStore.getMessages(chatRoomId.value, currentOffset.value, loadLimit.value);

      if (newMessages.length) {
        items.value = [...newMessages, ...items.value];
        currentOffset.value += newMessages.length;
      } else {
        hasMore.value = false; // No more messages to load
      }

      done(); // Always call done after load finishes
    };
    watch(chatRoomId, () => {
      
        // Reset the state for the new chat room
        items.value = [];
        currentOffset.value = 0;
        hasMore.value = true;
        
        // Trigger initial load for the new chat room
        onLoad(0, () => {
            scroll_dole();
      });
      
    });
    watch(
      () => chatStore.new_messages,
      (newMessages) => {
        items.value = [ ...items.value,...newMessages];
      },
      { immediate: true }
    );
    onMounted(() => {
        scroll_dole(); // Scroll to bottom on initial load
    });

    return {
      items,
      onLoad,
      messageContainer
    };
    }
  }
  </script>
  <style scoped>
  div {
  background-color: white;
  height: 100%;
}

.chat-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.message-container {
  flex-grow: 1;
  overflow-y: auto;
  padding-bottom: 1rem;
}

.q-infinite-scroll {
  flex-grow: 1;
} </style>