<script setup lang="ts">
import { ref } from 'vue';

const username = ref('');
const password = ref('');
const name = ref('');
const surname = ref('');
const email = ref('');

const register = () => {
  // Handle login logic here
  console.log(`Username: ${username.value}, Password: ${password.value}`);
};
</script>

<template>
  <div class="q-pa-md">
    <q-form @submit="register" class="q-gutter-md">
  
  <q-input
    v-model="name"
    filled
    label="Name"
    type="text"
    hint="Enter your first name"
    required
  />

  <q-input
    v-model="surname"
    filled
    label="Surname"
    type="text"
    hint="Enter your last name"
    required
  />
  
  <q-input
    v-model="email"
    filled
    label="Email"
    type="email"
    hint="Enter your email"
    required
  />

  <q-input
    v-model="username"
    filled
    label="Username"
    type="text"
    hint="Enter your username"
    required
  />

  <q-input
    v-model="password"
    filled
    label="Password"
    type="password"
    hint="Enter your password"
    required
  />

  <q-btn type="submit" label="Register" color="primary" />
</q-form>

  </div>
</template>

<style scoped>
.q-pa-md {
  min-width: 400px;
  max-width: 600px;
  margin: auto;
}
</style>
