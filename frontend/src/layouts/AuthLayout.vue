9<template>
  <div class="q-pa-md row-container" style="height: 100vh; background: linear-gradient(lightcyan, lightblue)">
    <div class="col-4 flex flex-center" style="border: 1px solid black;">
      <router-view />
    </div>
    
    <q-separator vertical class="separator"/>

    <div class="col flex flex-center" style="border: 1px solid black;">
      <img class="obrazok" src="~assets/quasar-logo-vertical.svg" />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.row-container {
  display: flex;
  justify-content: space-between;
}

.obrazok {
  height: 90vh;
}

@media (max-width: 1100px) {
  .row-container {
    flex-direction: column;
    min-height: 150vh;
  }

  .separator {
    display: none;
  }

  .obrazok {
    height: 50vh;
  }
}
</style>
