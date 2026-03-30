<script setup>
import Toast from '../shared/Toast.vue';
import Confirm from '../shared/Confirm.vue';
import { computed, ref } from 'vue';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../server';

// получение данных и функций
const emit = defineEmits(['update:users'])

const props = defineProps({
    user: Object
})
const user = computed(() => props.user || {})


// для всплывающих окон
const isOpenConfirm = ref('')
const AddTrigger = ref(0)
const ErrorTrigger = ref(0)

// отображение статуса
const message = ref('')

// изменение статуса
async function changeRole(role) {
    let m;
    switch (role) {
        case 'ban':
            m = 'забанить'
            break;
        case 'mute':
            m = 'ограничить'
            break;
        case 'user':
            m = 'разбанить'
            break;
    }
    message.value = m
    try {
        await updateDoc(doc(db, "users", user.value.id), {
            role: role
        }
        )
        console.log(role)
        AddTrigger.value++
        isOpenConfirm.value = ''
        emit('update:users')
    } catch (e) {
        console.log(e, "deiwdjiejdiejdiejdiej")
        ErrorTrigger.value++
        isOpenConfirm.value = ''
    }
};

</script>
<template>
    <Toast :trigger="AddTrigger" :text="'Получилось ' + message + '!'" />
    <Toast :trigger="ErrorTrigger" :text="'Не удалось ' + message + '!'" :isErr="true" />
    <div class="UserActive">
        <button v-if="user?.role != 'ban'" v-on:click="isOpenConfirm = 'ban'">Забанить</button>
        <Confirm v-if="isOpenConfirm == 'ban'" :text="'Хотите забанить?'" @doThis="changeRole('ban')"
            @update:trigger="isOpenConfirm = ''" />
        <button v-if="user?.role != 'mute'" v-on:click="isOpenConfirm = 'mute'">Ограничить</button>
        <Confirm v-if="isOpenConfirm == 'mute'" :text="'Хотите ограничить?'" @doThis="changeRole('mute')"
            @update:trigger="isOpenConfirm = ''" />
        <button v-if="user?.role != 'user'" v-on:click="isOpenConfirm = 'user'"
            style="border: 1px green solid;">Разбанить</button>
        <Confirm v-if="isOpenConfirm == 'user'" :text="'Хотите разбанить?'" @doThis="changeRole('user')"
            @update:trigger="isOpenConfirm = ''" />
    </div>

</template>
<style scoped>
.UserActive {
    width: 100%;
    display: flex;
    gap: 5px;

    justify-content: end;
}

.UserActive button {
    font-size: small;
    color: #333;
    background-color: #ffffff61;
    border: red 1px solid;
}
</style>