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
              <q-item clickable v-close-popup @click="onMenuCommands">
                <q-item-section side>
                  <q-icon name="list"/>
                </q-item-section>
                <q-item-section>
                  Commands
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="onMenuLogOut">
                <q-item-section side>
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
      <terminal-component />
    </q-footer>

    <q-dialog v-model="isCommandDialogVisible">
      <q-card>
        <q-card-section>
          <div class="text-h6">Commands</div>
        </q-card-section>

        <q-card-section>
          <p>
            /join private
            <br>
            /create
            <br>
            /revoke
          </p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DrawerChatRoom from 'components/DrawerChatRoom.vue';
import TerminalComponent from 'components/TerminalComponent.vue';

const headerMenu = ref(false)
const leftDrawerOpen = ref(false)
const isCommandDialogVisible = ref(false)  // Dialog visibility control

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const onMenuCommands = () => {
  isCommandDialogVisible.value = true
  headerMenu.value = !headerMenu.value
}

const onMenuLogOut = () => {
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

