<script setup>
import SliderImage from '../Home/SliderImage.vue';
import SearchItem from '../shared/SearchItem.vue';
import AddFlat from './AddFlat.vue';
import ChangeFlat from './ChangeFlat.vue';
import ReserveFlatList from './ReserveFlatList.vue';
import RenderBooks from './RenderBooks.vue';
import { useRouter } from 'vue-router';
import { computed, onMounted, ref, watchEffect } from 'vue';
import { getAllBooks, getFlatById, getFlats } from '../../server';


// получение данных
const props = defineProps({
    isUserData: Number
})
const isUserData = computed(() => props.isUserData)


const isFlatData = ref(0);


// Резервы
const books = ref([])
const booksFixed = ref([])

async function updateBooks() {
    books.value = await getAllBooks()
    booksFixed.value = books.value
}

onMounted(async () => {
    await updateBooks()
})

function fixBooks(id) {
    booksFixed.value = books.value.filter(e => e.id == id)
    isFlatData.value = 0
}

function allBooks() {
    booksFixed.value = books.value
    isFlatData.value = 0
}


/////


// резервы с названием
const reserves = ref([])
const isLoading = ref(true)

watchEffect(async () => {
    isLoading.value = true

    reserves.value = await Promise.all(
        booksFixed.value.flatMap((item) =>
            item.liked.map(async (e) => ({
                ...e,
                flat: await getNameReserve(item.id)
            }))
        )
    )
    reserves.value = reserves.value.filter((e) => e.start !== undefined)
    reserves.value = reserves.value.sort((a, b) =>
        new Date(a.start) - new Date(b.start)
    )
    console.log(reserves.value)

    isLoading.value = false
})

async function getNameReserve(id) {
    const flat = await getFlatById(id)
    return flat.name
}


// лимит отображение

;
</script>
<template>
    <div :class="{ none: isUserData !== 2 }" class="UsersWrapper">
        <div class="reserveButtons">
            <button @click="isFlatData = 1">Выбрать по квартире</button>
            <button @click="allBooks">Все резервы</button>
        </div>
        <ReserveFlatList :isFlatData="isFlatData" @fix:books="val => fixBooks(val)"/>
        <RenderBooks :booksFixed="reserves" :isLoading="isLoading" :isFlatData="isFlatData" />
    </div>
</template>
<style scoped>
.UsersWrapper {
    margin-top: 20px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;

}

.none {
    display: none;
}

.reserveButtons {
    display: flex;
    justify-content: center;
    gap: 10px;
}

@media (max-width:900px) {
    .reserveButtons {
        width: 100%;
        align-items: center;
        flex-direction: column;

        & > button {
            width: 200px;
        }
    }


}
</style>