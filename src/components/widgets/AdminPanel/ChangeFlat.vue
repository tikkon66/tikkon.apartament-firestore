<script setup>
import Confirm from '../shared/Confirm.vue';
import Toast from '../shared/Toast.vue';
import DataWindow from './DataWindow.vue';
import { ref } from 'vue';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../server';

// получение данных и функций
const emit = defineEmits(['update:flats'])

const props = defineProps({
    flat: Object
})

const flat = ref(props.flat)
const idFlat = flat.value.id
const archive = ref(flat.value.archive)


// для всплывающих окон
const isOpenDataForm = ref(false)
const isOpenDataForm2 = ref(false)

const isOpenConfirm = ref(false)
const AddTrigger = ref(0)
const ErrorTrigger = ref(0)

// сообщение
const message = ref("")

// изменение кв
async function changeFlat() {
    message.value = "изменить"
    try {
        console.log(flat.value)
        await updateDoc(doc(db, "flats", idFlat), flat.value)

        isOpenDataForm2.value = false
        isOpenConfirm.value = false
        AddTrigger.value++
        emit('update:flats')

    }
    catch (e) {
        console.log(e)
        isOpenDataForm.value = false
        isOpenConfirm.value = false
        ErrorTrigger.value++
    }
}

// Архирировать кв
async function archiveFlat(isArch = true) {
    message.value = isArch ? "архивировать" : "разархивировать"
    try {
        console.log(flat.value)
        await updateDoc(doc(db, "flats", idFlat), {
            archive: isArch
        })
        archive.value = isArch
        isOpenDataForm2.value = false
        isOpenConfirm.value = false
        AddTrigger.value++
        emit('update:flats')

    }
    catch (e) {
        console.log(e)
        isOpenDataForm.value = false
        isOpenConfirm.value = false
        ErrorTrigger.value++
    }
}

// Удалить кв
async function deleteFlat() {
    message.value = "удалить"
    try {
        console.log(flat.value)
        await deleteDoc(doc(db, "flats", idFlat))

        isOpenDataForm2.value = false
        isOpenConfirm.value = false
        AddTrigger.value++
        emit('update:flats')

    }
    catch (e) {
        console.log(e)
        isOpenDataForm.value = false
        isOpenConfirm.value = false
        ErrorTrigger.value++
    }
};

</script>
<template>

    <Toast :trigger="AddTrigger" :text="'Получилось ' + message + '!'" />
    <Toast :trigger="ErrorTrigger" :text="'Не удалось ' + message + '!'" :isErr="true" />
    <div class="UserActive">

        <DataWindow v-if="isOpenDataForm2" :isOpenDataForm="isOpenDataForm" :flat="flat" :message="'изменить'"
            @update:data="val => flat = val" @close:window="isOpenDataForm = false"
            @doThis="isOpenConfirm = 'change'" />
        <button @click="isOpenDataForm = true; isOpenDataForm2 = true"
            style="border: 1px green solid;">Изменить</button>
        <Confirm v-if="isOpenConfirm == 'change'" :text="'Подвердите добавление!'" @doThis="changeFlat"
            @update:trigger="isOpenConfirm = ''" />


        <button v-if="archive" v-on:click="isOpenConfirm = 'disArch'">Разархивировать</button>
        <Confirm v-if="isOpenConfirm == 'disArch'" :text="'Хотите разархивировать?'" @doThis="archiveFlat(false)"
            @update:trigger="isOpenConfirm = ''" />

        <button v-if="!archive" v-on:click="isOpenConfirm = 'arch'">Архивировать</button>
        <Confirm v-if="isOpenConfirm == 'arch'" :text="'Хотите архивировать?'" @doThis="archiveFlat"
            @update:trigger="isOpenConfirm = ''" />

        <button v-on:click="isOpenConfirm = 'delete'">Удалить</button>
        <Confirm v-if="isOpenConfirm == 'delete'" :text="'Хотите удалить?'" @doThis="deleteFlat"
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