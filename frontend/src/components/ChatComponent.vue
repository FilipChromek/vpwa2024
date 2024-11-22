<template>
  <q-page class="row items-stretch">
    <div
      ref="chatContainer"
      class="chat-container q-pa-md col-12 justify-end bg-grey-2"
    >
      <q-infinite-scroll @load="onLoad" reverse>
        <!--        <template v-slot:loading>-->
        <!--          <div class="row justify-center q-my-md">-->
        <!--            <q-spinner color="primary" name="dots" size="40px" />-->
        <!--          </div>-->
        <!--        </template>-->
        <q-chat-message
          v-for="(message, index) in messages"
          :key="index"
          :name="message.author.username"
          :text="[message.content]"
          :sent="message.author.id === authStore.user?.id"
        />
      </q-infinite-scroll>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { QInfiniteScrollProps } from 'quasar';
import { Message } from 'components/models';
//import { useChatStore } from 'stores/chatStore';
//import { useRoute } from 'vue-router';
import { useAuthStore } from 'stores/authStore';
//import { useOldChatStore } from 'stores/store';
import { useChatStore } from 'stores/chatStore';
import { useRoute } from 'vue-router';

const chatContainer = ref<HTMLElement | null>(null);
const chatStore = useChatStore();
// const oldChatStore = useOldChatStore();
const authStore = useAuthStore();
// const route = useRoute();

// const chatStore = useChatStore();
const route = useRoute();

onMounted(() => {
  const channelId = parseInt(route.params.id as string, 10);
  chatStore.connectToChannel(channelId);
});

defineProps<{
  messages: Message[];
}>();

const onLoad: QInfiniteScrollProps['onLoad'] = (_, done) => {
  setTimeout(() => {
    // oldChatStore.lazyLoadMessages(parseInt(route.params.id as string, 10));
    done(false);
  }, 1500);
};

const scrollToBottom = () => {
  if (chatContainer.value) {
    setTimeout(() => {
      window.scrollTo(0, chatContainer.value!.scrollHeight);
    }, 0);
  }
};

onMounted(() => {
  scrollToBottom();
});

watch(
  () => chatStore.messages.length,
  () => {
    console.log('scrolling to bottom');
    scrollToBottom();
  },
  { deep: true }
);
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
}
</style>
