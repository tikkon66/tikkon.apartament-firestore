<script setup>
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref } from 'vue'
import { useAuth, db } from '../../server';
import Toast from '../shared/Toast.vue';
import Confirm from '../shared/Confirm.vue';

// Данные функций для комента
const emit = defineEmits(['update:coments'])

const { idFlat } = defineProps({
    idFlat: String,
})

const { user, userData } = useAuth();


// Рейтинг
const rating = ref(0)

function toggle(n) {
    rating.value = n;
}

const isOpenConfirm = ref(false)
function openConfirm() {
    if (rating.value == 0) return
    isOpenConfirm.value = true
}

// Добавление комента
const coment = ref("")
async function addCom() {
    try {
        console.log(rating.value)
        await addDoc(collection(db, "coments"), {
            coments: coment.value,
            idUser: user.value.uid || userData.value.id, // точно есть
            idFlat: idFlat,
            ratings: rating.value,
            createdAt: serverTimestamp(),
        });
        coment.value = "";
        rating.value = 0;
        console.log("Комментарий добавлен!");
        isOpenConfirm.value = false
        AddTrigger.value += 1
        emit('update:coments')
    } catch (error) {
        console.error("Ошибка при добавлении комментария:", error.message);
        isOpenConfirm.value = false
        ErrorTrigger.value += 1
    }
}


// всплывающяя окошка при добавление комента
const AddTrigger = ref(0);
const ErrorTrigger = ref(0);

</script>
<template>
    <Toast :trigger="AddTrigger" :text="'Отзыв добавлен!'" />
    <Toast :trigger="ErrorTrigger" :text="'Ошибка при добавление отзыва!'" :isErr="true" />
    <div class="ComentWrapper">
        <div class="RatingWrapper">
            <div v-for="n in 10" class="star" :class="{ active: n <= rating }" @click="toggle(n)"></div>
        </div>
        <div class="ComentInputWrapper">
            <textarea name="message" id="msg" v-model="coment" placeholder="Ваш отзыв к этой квартире"></textarea>
            <button @click="openConfirm">Добавить</button>
        </div>
    </div>
    <Confirm v-if="isOpenConfirm" :text="'Подтвердите добавление отзыва'" @doThis="addCom"
        @update:trigger="isOpenConfirm = false" />
</template>
<style scoped>
.ComentWrapper {
    padding: 10px;
    background: #f4f4f4;
    border-radius: 12px;

    display: flex;
    flex-direction: column;
    gap: 10px;
}

.RatingWrapper {
    display: flex;
    gap: 5px;

}

.star::before {
    content: "★";
    font-size: 30px;
    color: gray;
    cursor: pointer;
}

.star.active::before {
    color: gold;
}

.ComentInputWrapper {
    display: flex;
    gap: 5px;
}

.ComentInputWrapper button {
    font-size: 13px;
}

.ComentInputWrapper textarea {
    resize: vertical;
    padding: 2px 6px;

    width: 90%;
    height: 30px;
    min-height: 30px;

    border: #525252 solid 1px;
    border-radius: 16px;
    background-color: #fff;
    color: #222;
    font-size: 15px;
    font-family: inherit;
}

@media (max-width: 1100px) {
    .star::before {
        font-size: 25px;
    }

    .RatingWrapper {
        display: flex;
        gap: 5px;
        justify-content: space-between

    }
}
</style>