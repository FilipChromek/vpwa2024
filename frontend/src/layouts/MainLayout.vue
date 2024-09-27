<template>
  <q-layout view="hHh lpR lFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          ZapoChat
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above v-model="leftDrawerOpen"
      side="left"
      bordered

      :width="250"
      class="bg-secondary"
    >
      <drawer-chat-room />
    </q-drawer>

    <q-page-container
      class="flex flex-col">
      <chat-component class="flex-grow-1 full-height overflow-auto"/>
    </q-page-container>

    <q-footer elevated
              class="bg-grey-3 q-pa-md">
      <q-input
        rounded
        outlined
        class="terminal"
        input
        :input-style="{ fontSize: '16px' }">
        <template v-slot:prepend>
          <q-icon name="send"/>
        </template>
      </q-input>
    </q-footer>
  </q-layout>
</template>

<script>
import { ref } from 'vue'
import DrawerChatRoom from 'components/DrawerChatRoom.vue';
import ChatComponent from 'components/ChatComponent.vue';

export default {
  components: {ChatComponent, DrawerChatRoom},
  setup () {
    const leftDrawerOpen = ref(false)

    return {
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
}
</script>

<style scoped>
.terminal {
  margin: auto;
  display: block;
  width: 100%;
}
</style>

