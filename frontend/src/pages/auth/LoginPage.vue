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
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

const email = ref('');
const password = ref('');

axios.defaults.baseURL = 'http://localhost:3333';

const login = async () => {
  const form = {
    email: email.value,
    password: password.value,
  };

  try {
    const response = await axios.post('login', form);
    const { token } = response.data;
    localStorage.setItem('authToken', token.token);

    router.push('/');
  } catch (error) {
    console.error(error);
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
