<template>
  <q-page class="row items-stretch">
    <div
      ref="chatContainer"
      class="chat-container q-pa-md col-12 justify-end bg-grey-2"
    >
      <q-infinite-scroll @load="onLoad" reverse>
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner color="primary" name="dots" size="40px" />
          </div>
        </template>
        <q-chat-message
          v-for="(message, index) in messages"
          :key="index"
          :name="message.content"
          :text="[message.content]"
          :sent="message.id === currentUserId"
        />
      </q-infinite-scroll>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { Message } from 'components/models';
import { QInfiniteScrollProps } from 'quasar';
//import { useChatStore } from 'stores/chatStore';
import { useRoute } from 'vue-router';
import { useAuthStore } from 'stores/authStore';
import { useOldChatStore } from 'stores/store';

defineProps<{
  messages: Message[];
}>();

const chatContainer = ref<HTMLElement | null>(null);
//const chatStore = useChatStore();
const oldChatStore = useOldChatStore();
const authStore = useAuthStore();
const currentUserId = authStore.user?.id;
const route = useRoute();

const onLoad: QInfiniteScrollProps['onLoad'] = (_, done) => {
  setTimeout(() => {
    oldChatStore.lazyLoadMessages(parseInt(route.params.id as string, 10));
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

watch(
  () => oldChatStore.newMessageFlag,
  (newMessageFlag) => {
    if (newMessageFlag) {
      scrollToBottom();
      oldChatStore.newMessageFlag = false;
    }
  },
  { deep: true }
);

onMounted(() => {
  scrollToBottom();
});
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
}
</style>
