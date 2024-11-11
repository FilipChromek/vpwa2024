<template>
  <div class="q-pa-md">
    <q-form @submit="register" class="q-gutter-md">
      <q-input
        v-model="firstName"
        filled
        label="Name"
        type="text"
        hint="Enter your first name"
        required
      />

      <q-input
        v-model="lastName"
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
    <br />
    <a href="/auth/login">I want to login</a>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from 'stores/authStore';

const authStore = useAuthStore();

const firstName = ref('');
const lastName = ref('');
const username = ref('');
const email = ref('');
const password = ref('');

const register = async () => {
  try {
    await authStore.register({
      firstName: firstName.value,
      lastName: lastName.value,
      username: username.value,
      email: email.value,
      password: password.value,
    });
  } catch (error) {
    console.error('Register failed:', error);
  }
};
</script>

<style scoped>
.q-pa-md {
  min-width: 400px;
  max-width: 600px;
  margin: auto;
}
</style>
