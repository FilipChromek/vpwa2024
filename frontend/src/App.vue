<template>
  <router-view />
</template>

<script setup lang="ts">
import { useAppVisibility } from 'src/composables/useAppVisibility';

defineOptions({
  name: 'App',
});

useAppVisibility();
</script>
