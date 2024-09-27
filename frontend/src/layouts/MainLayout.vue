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

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="text-white q-pa-md">
      <q-toolbar class="terminal-container rounded-borders">
        <q-input rounded standout v-model="text" class="terminal bg-secondary">
          <template v-slot:prepend>
            <q-icon name="send"/>
          </template>
        </q-input>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script>
import { ref } from 'vue'
import DrawerChatRoom from 'components/DrawerChatRoom.vue';

export default {
  components: {DrawerChatRoom},
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

