<template>
  <div class="row" style="height: 100vh">
    <div class="col-4" style="border: 1px solid black;">
      <router-view/>
    </div>
    <q-separator vertical/>
    <div class="col" style="border: 1px solid black;">
    <q-avatar>
        <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
      </q-avatar>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>
