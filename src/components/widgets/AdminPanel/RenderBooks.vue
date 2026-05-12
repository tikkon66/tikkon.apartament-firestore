<script setup>
import { computed, ref } from 'vue';
import { getFlatById } from '../../server';
import SearchItem from '../shared/SearchItem.vue';


// получение данных
const props = defineProps({
    isFlatData: Number,
    booksFixed: {
        type: Array,
        default: () => []
    },

    isLoading: Boolean
})
const isUserData = computed(() => props.isFlatData)
const books = computed(() => props.booksFixed || [])
const booksSearch = ref([])
booksSearch.value = books.value


console.log(booksSearch.value)

const limit = ref(5)
const booksFixed = computed(() => {
    return booksSearch.value.slice(0, limit.value);
});

</script>
<template>
    <div v-show="isUserData == 0" class="UsersWrapper">
        <SearchItem :items="books" @update:items="val => booksSearch = val" />
        <div v-if="isLoading">
            Загрузка...
        </div>

        <div v-else-if="booksFixed.length">


            <div v-for="book in booksFixed" style="display: flex; flex-direction: column; gap: 5px; ">
                <div class="reserveWrapper">
                    <div class="flatName">
                        <b>{{ book?.flat }}</b>
                        <i>Создано: {{ book?.createdAt }}</i>
                    </div>

                    <div class="line"></div>

                    <div>
                        <b>От: {{ book?.start }}</b>
                        <b>До: <i>{{ book?.end }}</i></b>
                    </div>
                </div>
            </div>
            <b v-if="limit < booksSearch.length" class="seeMore" @click="limit += 5">Показать ещё...</b>
        </div>

        <div v-else>
            Нет данных
        </div>
    </div>
</template>

<style scoped>
.UsersWrapper {
    margin-top: 30px;
    margin-bottom: 30px;
    display: flex;
    flex-direction: column;

    gap: 20px;

    &>div {
        display: flex;
        flex-direction: column;
    }
}

.none {
    display: none;
}

.reserveWrapper {
    display: flex;
    gap: 15px;
    margin: 20px 0;

    border: solid #333 1px;
    border-radius: 7px;
    padding: 10px;

    &>div {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
}

.flatName {
    width: 500px;
}

.line {
    width: 1px;
    height: 50px;
    background-color: #333;
}

@media (max-width:900px) {
    .flatName {
        width: 100%;
    }

    .reserveWrapper {
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .line {
        width: 101%;
        height: 1px;
    }
}
</style>