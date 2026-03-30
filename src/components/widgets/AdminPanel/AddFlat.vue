<script setup>
import DataWindow from './DataWindow.vue';
import Toast from '../shared/Toast.vue';
import Confirm from '../shared/Confirm.vue';
import { addNewFlat } from '../../server';
import { ref } from 'vue';


// получение функций
const emit = defineEmits(['update:flats'])


// для всплывающих окон
const isOpenDataForm = ref(false)
const isOpenDataForm2 = ref(false)

const isOpenConfirm = ref(false)
const AddTrigger = ref(0)
const ErrorTrigger = ref(0)


// добавление новой квартиры 
const newFlat = ref({})

async function doSomething(item) {
    try {
        console.log(item)
        await addNewFlat(item)

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
    <Toast :trigger="AddTrigger" :text="'Получилось добавить!'" />
    <Toast :trigger="ErrorTrigger" :text="'Не удалось добавить!'" :isErr="true" />
    <DataWindow  v-if="isOpenDataForm2" :isOpenDataForm="isOpenDataForm" :message="'добавить'" @update:data="val => newFlat = val" @close:window="isOpenDataForm = false"
        @doThis="isOpenConfirm = true" />
    <button @click="isOpenDataForm = true;isOpenDataForm2 = true"> Добавить квартиру</button>
    <Confirm v-if="isOpenConfirm" :text="'Подвердите добавление!'" @doThis="doSomething(newFlat)"
        @update:trigger="isOpenConfirm = false" />

</template>
<style scoped></style>