<template>
  <div class="q-pa-md">
    <q-form @submit="login" class="q-gutter-md">
      <q-input
        v-model="email"
        filled
        label="Email"
        type="email"
        hint="Enter your email"
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

      <q-btn type="submit" label="Login" color="primary" />
    </q-form>
    <br />
    <a href="/auth/register">I want to register</a>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from 'stores/authStore';

const email = ref('');
const password = ref('');
const authStore = useAuthStore();

const login = async () => {
  try {
    await authStore.login({ email: email.value, password: password.value });
  } catch (error) {
    console.error('Login failed:', error);
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
