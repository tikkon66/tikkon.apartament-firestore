<script setup>
import Footer from '../widgets/Footer.vue';
import Header from '../widgets/Header.vue';
import Confirm from '../widgets/shared/Confirm.vue';
import Toast from '../widgets/shared/Toast.vue';
import { useRoute } from 'vue-router';
import { db, getPrivateData, useAuth } from '../server';
import { computed, onMounted, ref, watch } from 'vue';
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

// Данные юзера
const route = useRoute()
const idUser = route.params.id

const { user, userData } = useAuth()
const privateData = ref([])

onMounted(async () => {
    privateData.value = await getPrivateData(idUser);

})

// Ава
const avatarNow = computed(() => userData.value?.avatar)
const avatar = ref("")

watch(userData, (val) => {
    if (val?.name) {
        name.value = val.name
        avatar.value = val.avatar
    }
})

watch(privateData, (val) => {
    if (val?.email) {
        email.value = val.email
    }
})


// Данные для логина и регистрация
const name = ref("");
const nameValid = computed(() => {
    return /^(admin|админ)\d*$/i.test(name.value);
})

const email = ref("");
const emailValid = computed(() => {
    return /^[^\s@]+@[^s@]+\.[^\s@]+$/.test(email.value);
})

const oldPassword = ref("")
const password = ref("");
const passwordValid = computed(() => {
    return password.value.length >= 6 || password.value.length == 0
})

const allValid = computed(() => {
    return emailValid.value && passwordValid.value && !nameValid
})


// Для всплывающих окон
const isEditAvatar = ref(false)
const isOpenConfirm = ref(false)
const AddTrigger = ref(0);
const ErrorTrigger = ref(0);

// изменение
async function editData() {
    if (!allValid) return

    const auth = getAuth()
    const user = auth.currentUser
    if (!user || !user.email) return

    try {

        if (password.value.length !== 0) {
            const credential = EmailAuthProvider.credential(
                user.email,
                oldPassword.value
            )
            await reauthenticateWithCredential(user, credential)
            await updatePassword(user, password.value)
        }

        await updateDoc(doc(db, "users", idUser), {
            name: name.value,
            avatar: avatar.value
        })
        await updateDoc(doc(db, "usersPrivate", idUser), {
            email: email.value
        })

        AddTrigger.value++
        isOpenConfirm.value = false

        window.location.reload()
    } catch (e) {
        console.log(e, "deiwdjiejdiejdiejdiej")
        isOpenConfirm.value = false
        ErrorTrigger.value++
    }
}

;
</script>
<template>
    <Toast :trigger="AddTrigger" :text="'Отредактировано!'" />
    <Toast :trigger="ErrorTrigger" :text="'Неверный пароль!'" :isErr="true" />
    <div class="EditAvatar" v-if="isEditAvatar">
        <div class="AvatarInput">
            <input type="text" v-model="avatar">
            <button @click="isEditAvatar = false">Подтвердить</button>
        </div>
    </div>
    <div class="container">
        <Header />
        <div class="wrapper">
            <div class="EditorWrapper">
                <div class="ProfileImage">
                    <div class="ImageWrapp">
                        <b>Фото профиля</b>
                        <img :src="avatarNow" alt="Фото профиля">
                    </div>
                    <button @click="isEditAvatar = true">Изменить</button>
                </div>

                <div class="ProfileData">
                    <b>Изменение данных</b>
                    <div class="DataInputs">
                        <input :class="{ error: nameValid }" type="text" placeholder="Ваше имя" v-model="name">
                        <input :class="{ error: !emailValid }" type="text" placeholder="Ваш email" v-model="email">
                        <input :class="{ error: !passwordValid }" type="password" placeholder="Новый пароль"
                            v-model="password">

                    </div>
                    <div class="DataConfirm">
                        <input type="password" placeholder="Старый пароль" v-model="oldPassword">
                        <button @click="isOpenConfirm = true">Редактировать данные</button>
                        <Confirm v-if="isOpenConfirm" :text="'Подтвердите бронирование квартиры'" @doThis="editData"
                            @update:trigger="isOpenConfirm = false" />
                    </div>
                </div>
            </div>
        </div>
        <Footer />

    </div>
</template>
<style scoped>
.EditAvatar {
    position: absolute;
    z-index: 5;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;

    display: flex;
    justify-content: center;
    align-items: center;

    background-color: #bbbbbb8d;
}

.AvatarInput {
    display: flex;
    flex-direction: column;
    gap: 5px;
    width: 300px;

    padding: 10px;

    background-color: #f9f9f9;

    border-radius: 8px;
}

.ProfileData {
    display: flex;
    flex-direction: column;
    gap: 30px;

    align-items: center;
    padding: 10px;

    background-color: #f9f9f9;
    border-radius: 8px;
    border: 1px solid #bbbbbb;

}

.DataInputs {
    display: flex;
    flex-direction: column;
    gap: 7px;
}

.DataConfirm {
    display: flex;
    flex-direction: column;
    gap: 7px;
}

.EditorWrapper {
    padding: 65px 0;
    color: #333;
    width: 100%;

    display: flex;
    gap: 10px;
}

.EditorWrapper input {
    border-radius: 8px;
}

.ProfileImage {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.ProfileImage button {
    width: 100%;
}

.ImageWrapp {
    display: flex;
    flex-direction: column;
    gap: 10px;

    align-items: center;
    padding: 10px;

    background-color: #f9f9f9;
    border-radius: 8px;
    border: 1px solid #bbbbbb;
}

.ImageWrapp img {
    width: 160px;
}

.error {
    color: red;
    border: 1px solid red;
}

.container {
    display: flex;
    flex-direction: column;
    height: 100vh;

}

.wrapper {
    flex: 1;
}


@media (max-width: 1010px) {
.EditorWrapper {
    flex-direction: column;
    gap: 30px;
}}
</style>