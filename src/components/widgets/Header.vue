<script setup>
import AuthWindow from "./AuthWindow.vue";
import { ref } from "vue";
import { useAuth, isAuthenticated } from "../server";
import Nav from "./Nav.vue";

// Отслеживание авторизаций и данные о пользователи
const {user, userData} = useAuth();

// Окошка логина
const authWindow = ref(false);

</script>

<template>
  <header class="header">
    <router-link to="/">
      <img class="emblem" src="../../assets/Home/emblem.png" alt="emblem" />
    </router-link>
    <Nav v-if="isAuthenticated" :userData="userData"/>

    <button v-if="!isAuthenticated" @click="authWindow = true" class="auth-button">
      Войти <span class="none">/ Регистрация</span>
    </button>
    <AuthWindow v-if="authWindow" @close="authWindow = false" />
  </header>
</template>

<style scoped>
.header {
  position:fixed;
  z-index: 4;
  background: #1c1c1c;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.header > * {
  margin: 8px;
}

.emblem {
  height: 30px;
}

.auth-button {
  color: #1c1c1c;
  background-color: #fafafa;
}


@media (max-width: 800px) {
  .auth-button {
    font-size: small;
    padding: 10px;
  }
  .none {
    display: none;
  }
}
</style>
