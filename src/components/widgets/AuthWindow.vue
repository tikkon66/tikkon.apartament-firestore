<script setup>
import { ref } from "vue";
import { auth, db } from "../server.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";


// Эмит для закрытие
const emit = defineEmits(["close"])

// Для изменение логина и регистраций
const isLogin = ref(true);


// Данные для логина и регистрация
const name = ref("");
const nameValid = ref(false);
function isNameValid() {
  nameValid.value = /^(admin|админ)\d*$/i.test(name.value);
}

const email = ref("");
const emailValid = ref(true);
function isEmailValid() {
  emailValid.value = /^[^\s@]+@[^s@]+\.[^\s@]+$/.test(email.value);
}

const password = ref("");
const password2 = ref("");
const password2Valid = ref(true);
function isPassword2Valid() {
  password2Valid.value = password.value == password2.value;
}


// Сообщение ошибки
const errorMessage = ref("");


// Логика логина и регистрация
async function register() {
  if (!emailValid.value || !password2Valid.value || nameValid.value) return;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value,
    );
    await setDoc(doc(db, "usersPrivate", userCredential.user.uid), {
      liked: [],
      booked: [],
      balance: 0,
      email: email.value,
    });
    await setDoc(doc(db, "users", userCredential.user.uid), {
      avatar: "https://cdn-icons-png.flaticon.com/512/12225/12225935.png",
      name: name.value,
      role: "user",
      createdAt: new Date(),
    });
    window.location.reload()
    emit("close");
  } catch (err) {
    console.error("Ошибка регистрации:", err.code, err.message);

    if (err.code === "auth/email-already-in-use") {
      errorMessage.value = "Пользователь уже зарегистрирован";
    } else if (err.code === "auth/weak-password") {
      errorMessage.value = "Пароль меньше 6 символов";
    } else if (err.code === "auth/invalid-email") {
      errorMessage.value = "Введите корректный email";
    }
  }
}

async function login() {
  if (!emailValid.value || !password2Valid.value) return;

  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    window.location.reload()
    emit("close");
  } catch (error) {
    console.error("Ошибка регистрации:", error.code, error.message);
    console.log(email.value, password.value);

    if (error.code === "auth/invalid-credential") {
      errorMessage.value = "Не правильный email или пароль";
    } else if (error.code === "auth/wrong-password") {
      errorMessage.value = "Неверный пароль";
    } else if (error.code === "auth/invalid-email") {
      errorMessage.value = "Введите корректный email";
    }
  }
}

</script>
<template>
  <div class="modalOverlay" style="margin: 0">
    <div v-if="isLogin" class="form Card">
      <div class="exitWrapper">
        <div class="exit" @click="$emit('close')"></div>
      </div>

      <b>Авторизация</b>
      <form for="" class="inputs">
        <input @change="isEmailValid()" :class="{ error: !emailValid }" v-model="email" type="email"
          placeholder="Ваш email" />
        <input v-model="password" type="password" placeholder="Ваш пароль" />
      </form>

      <p style="color: red">{{ errorMessage }}</p>

      <div class="inputs">
        <button @click="login()">Войти</button>
        <button @click="isLogin = false">Нету аккаунта</button>
      </div>
    </div>

    <div v-if="!isLogin" class="form Card" style="margin: 0">
      <div class="exitWrapper">
        <div class="exit" @click="$emit('close')"></div>
      </div>

      <b>Регистрация</b>
      <form for="" class="inputs">
        <input @change="isNameValid()" :class="{ error: nameValid }" v-model="name" type="text"
          placeholder="Ваше имя" />

        <input @change="isEmailValid()" :class="{ error: !emailValid }" v-model="email" type="email"
          placeholder="Ваш email" />

        <input v-model="password" type="password" placeholder="Ваш пароль" />

        <input v-model="password2" @change="isPassword2Valid()" :class="{ error: !password2Valid }" type="password"
          placeholder="Повторите пароль" />
      </form>

      <p style="color: red">{{ errorMessage }}</p>

      <div class="inputs">
        <button @click="register()">Создать аккаунт</button>
        <button @click="isLogin = true">Уже есть аккаунт</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modalOverlay {
  position: fixed;
  top: 0px;
  left: 0px;
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3;
  background: rgba(164, 164, 164, 0.205);
}

.form {
  padding: 30px;
  max-width: 700px;
  color: #333;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

b {
  font-size: larger;
}

.inputs {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

input {
  font-size: medium;
}

.error {
  border: 2px solid red;
}
</style>
