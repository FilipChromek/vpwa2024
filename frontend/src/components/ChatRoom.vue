<template>
  <q-item
    clickable
    v-ripple
    tag="router-link"
    :to="`/channels/${channel.id}`"
    class="full-width"
  >
    <q-item-section avatar>
      <q-icon name="chat" />
    </q-item-section>
    <q-item-section>
      {{ channel.name }}
    </q-item-section>
    <q-btn dense flat round icon="more_vert" @click.stop.prevent>
      <q-menu v-model="chatMenu">
        <q-list style="width: 150px">
          <q-item
            clickable
            v-close-popup
            @click="channelStore.removeChannel(channel.id)"
          >
            <q-item-section side>
              <q-icon name="exit_to_app" color="red"></q-icon>
            </q-item-section>
            <q-item-section class="text-red-10"> Leave Chat </q-item-section>
          </q-item>
          <q-item
            clickable
            v-close-popup
            @click="channelStore.removeChannel(channel.id)"
          >
            <q-item-section side>
              <q-icon name="delete" color="red"></q-icon>
            </q-item-section>
            <q-item-section class="text-red-10"> Delete Chat </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </q-item>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue';
import { Channel } from 'components/models';
import { useChannelStore } from 'stores/channelStore';

const { channel } = defineProps<{
  channel: Channel;
}>();

const chatMenu = ref(false);
const channelStore = useChannelStore();
</script>

<style scoped></style>
