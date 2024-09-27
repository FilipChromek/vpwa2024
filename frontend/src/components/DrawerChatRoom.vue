<template>
  <q-scroll-area class="fit">
    <q-list>
      <template v-for="index in 10" :key="index">
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="chat"/>
          </q-item-section>
          <q-item-section>
            Index
          </q-item-section>
        </q-item>
        <q-separator/>
      </template>
    </q-list>
  </q-scroll-area>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>
