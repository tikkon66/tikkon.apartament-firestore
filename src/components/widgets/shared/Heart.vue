<script setup>
import AuthWindow from '../AuthWindow.vue';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { onMounted, ref } from 'vue';
import { db, getPrivateData, useAuth } from '../../server';

// получение данных
const { idFlat } = defineProps({
  idFlat: { type: String, default: "" }
})

const { user, userData } = useAuth()
const privateData = ref({})

const isLiked = ref(false);

// данные при прогрузке
onMounted(async () => {
  if (!user.value) return

  privateData.value = await getPrivateData(user.value?.uid)
  isLiked.value = privateData.value?.liked?.includes(idFlat) || false
})
    

// окошко авторизаций
const authWindow = ref(false);

// лайк
async function like() {
    
  if (!user.value) {
    isLiked.value = false;
    authWindow.value = true;
    return
  }
  const prev = !isLiked.value

  try {
    await updateDoc(doc(db, "usersPrivate", user.value?.uid), {
      liked: isLiked.value ? arrayUnion(idFlat) : arrayRemove(idFlat)
    }
    )
    console.log(isLiked.value)
  } catch (e) {
    console.log(e, "deiwdjiejdiejdiejdiej")
    isLiked.value = prev
  }
};

</script>

<template>
  <AuthWindow v-if="authWindow" @close="authWindow = false" />
  <label class="like">
    <input type="checkbox" v-model="isLiked" @change="like()" />
    <div class="heart"></div>
  </label>
</template>

<style scoped>
.like {
  position: absolute;
  top: 0px;
  right: 35px;
}

.like input {
  display: none;
}

.heart::before {
  content: "♡";
  font-size: 50px;
  height: fit-content;

  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%);

  color: #ff5252;

  cursor: pointer;
  transition: transform 0.1s;
}

.like:hover .heart::before {
  transform: translate(-50%) scale(1.08);
}

.like input:checked+.heart::before {
  content: "♥";
  transform: translate(-50%) scale(1);
}
</style>