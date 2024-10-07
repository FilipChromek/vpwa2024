<template>
  <div class="row" style="height: 100vh; background: linear-gradient(lightcyan,lightblue)">
    <div class="col-4 flex flex-center" style="border: 1px solid black;">
      <router-view/>
    </div>
    <q-separator vertical/>
    <div class="col flex flex-center"  style="border: 1px solid black; ">
    
        <img class="obrazok" src="~assets/quasar-logo-vertical.svg">
      
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

  .obrazok{

    height: 90vh;
    
  }
</style>
