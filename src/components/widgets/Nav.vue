<script setup>
import ExitIcon from "./shared/ExitIcon.vue";
import { useAuth, logout } from "../server";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const { user, userData } = useAuth();

const props = defineProps({
  userData: {type:Object, default: () => {}}
})
const role = computed(() => props.userData?.role || "")


// Переход на личный;
const router = useRouter();
function goToOfice() {
  router.push({ name: 'PersonalOffice'})
}
function goToAdmin() {
  router.push({ name: 'AdminPanel'})
}
function goToLiked() {
    router.push({ name: 'Favorite', params: { id: user.value?.uid }  })
}
function goToBooked() {
    router.push({ name: 'Reserves', params: { id: user.value?.uid }  })
}


const isOpenMenu = ref(false);
</script>

<template>
  <nav class="headerNav">
    <div class="navButton" @click="goToLiked">Избранные</div>
    <div class="navButton" @click="goToBooked">Бронированния</div>
    <div v-if="role == 'admin'" class="navButton" @click="goToAdmin">Админ-панель</div>
    <div class="navButton persCab">
      <img class="userAva" :src="userData?.avatar
        " :alt="userData?.name" />
      <div class="persCabDesc" @click="goToOfice">
        <b>{{ userData?.name }}</b>
        <span>Личный кабинет</span>
      </div>
    </div>
    <div class="exitLogin" @click="logout">
      <img src="https://www.freeiconspng.com/uploads/exit-icon-23.png" alt="выход" />
    </div>
  </nav>

  <div class="iconWrapper">
    <div v-if="!isOpenMenu" @click="isOpenMenu = true" class="menuIcon">
      <div></div>
      <div></div>
      <div></div>
    </div>
    <ExitIcon v-if="isOpenMenu" @close="isOpenMenu = false" />
  </div>

  <div :class="{ openMenu: isOpenMenu }" class="pullMenu" style="margin: 0px;">
    <div class="pullMenuList">
      <div class="navButton" @click="goToLiked">Избранные</div>
      <div class="navButton" @click="goToBooked">Бронированния</div>
      <div v-if="role == 'admin'" class="navButton" @click="goToAdmin">Админ-панель</div>
      <div class="navButton persCab">
        <img class="userAva" :src="userData?.avatar ||
          'https://cdn-icons-png.flaticon.com/512/12225/12225935.png'
          " :alt="userData?.name" />
        <div class="persCabDesc" @click="goToOfice">
          <b>{{ userData?.name }}</b>
          <span>Личный кабинет</span>
        </div>
      </div>
    </div>
    <div @click="logout" class="exitLogin" style="width: 100%">Выйти из аккаунта</div>
  </div>
</template>

<style scoped>
.headerNav {
  display: flex;
  align-items: center;
  gap: 28px;
}

.navButton {
  cursor: pointer;
  position: relative;
}

.navButton::before {
  content: "";
  position: absolute;
  width: 1px;
  right: -14px;
  top: 2px;
  bottom: 2px;
  background-color: #979797b0;
}

.navButton::after {
  content: "";
  position: absolute;
  bottom: -4px;
  left: 50%;

  width: 101%;
  height: 1px;
  background-color: red;

  transform: translateX(-50%) scaleX(0);
  transform-origin: center;
  transition: all 0.3s ease;
}

.navButton:hover::after {
  transform: translateX(-50%) scaleX(1);
}

.persCab {
  display: flex;
  align-items: center;
  gap: 5px;
}

.userAva {
  width: 30px;
  height: 30px;
}

.persCabDesc {
  display: flex;
  flex-direction: column;

  line-height: normal;
  font-size: small;
}

.iconWrapper {
  display: none;
}

.menuIcon {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 25px;
  height: 20px;
  cursor: pointer;
}

.menuIcon div {
  width: 100%;
  background-color: #fff;
  height: 3px;
}


.pullMenu {
  position: fixed;
  display: none;
  bottom: -100%;
  z-index: 4;

  flex-direction: column;
  height: 40vh;
  box-sizing: content-box;
  padding: 20px 10px 30px 10px;
  width: 100%;
  justify-content: space-between;

  background-color: #fff;
  color: #333;

  transition: all 0.3s ease;
}

.openMenu {
  bottom: 0;
}

.pullMenuList {
  display: flex;
  flex-direction: column-reverse;
  gap: 25px;
}

.exitLogin {
  width: 30px;
  display: flex;
  align-items: center;

  cursor: pointer;
  color: red;
  text-align: center;
}

.exitLogin img {
  width: 100%;
  transition: all 0.2s ease;
}

.exitLogin:hover img {
  transform: scale(1.05);
}

.exitLogin:active img {
  transform: scale(1);
}


@media (max-width: 900px) {
  .headerNav {
    display: none;
  }

  .iconWrapper,
  .pullMenu {
    display: flex;
  }

  .navButton::before {
    bottom: -4px;
    top: auto;
    left: 50%;

    width: 101%;
    height: 1px;

    transform: translateX(-50%) scaleX(1);
    transform-origin: center;
  }

  .exitLogin {
    width: 100%;
    color: red;
    justify-content: center;
  }
}
</style>
