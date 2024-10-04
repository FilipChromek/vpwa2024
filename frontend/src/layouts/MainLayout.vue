+<template xmlns:div="http://www.w3.org/1999/html">
  <q-layout view="hHH LpR lFF">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer"/>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          ZapoChat
        </q-toolbar-title>
        <q-btn dense flat round icon="more_vert">
          <q-menu v-model="headerMenu">
            <q-list style="width: 150px">
              <q-item clickable v-close-popup @click="onMenuSettings">
                <q-item-section>
                  <q-icon name="settings"/>
                </q-item-section>
                <q-item-section>
                  Settings
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="onMenuLogOut">
                <q-item-section>
                  <q-icon name="logout" color="red"/>
                </q-item-section>
                <q-item-section>
                  Log out
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above v-model="leftDrawerOpen"
      side="left"
      bordered
      :width="300"
      class="bg-grey-3"
    >
      <drawer-chat-room />
    </q-drawer>

    <q-page-container class="bg-grey-4">
      <router-view />
    </q-page-container>

    <q-footer elevated
              class="bg-grey-3 q-pa-md">
      <q-input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        placeholder="Type a message..."
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

<script setup lang="ts">

import { ref } from 'vue'
import DrawerChatRoom from 'components/DrawerChatRoom.vue';

const headerMenu = ref(false)
const leftDrawerOpen = ref(false)
const newMessage = ref('')

const sendMessage = () => {

  newMessage.value = ''
}

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const onMenuLogOut = () => {
  headerMenu.value = !headerMenu.value
}

const onMenuSettings = () => {
  headerMenu.value = !headerMenu.value
}

</script>

<style scoped>
.terminal {
  margin: auto;
  display: block;
  width: 100%;
}
</style>

