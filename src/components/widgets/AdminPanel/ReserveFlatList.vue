<script setup>
import { computed, onMounted, ref } from 'vue';
import { getFlats } from '../../server';
import RenderFlatCard from './RenderFlatCard.vue';
import SearchItem from '../shared/SearchItem.vue';


// получение данных
const props = defineProps({
    isFlatData: Number
})
const isUserData = computed(() => props.isFlatData)


const emit = defineEmits(["fix:books"])

// квартиры
const flats = ref([])
const flatsSearch = ref([])

async function updateFlats() {
    flats.value = await getFlats(true)
    flatsSearch.value = flats.value
}

onMounted(async () => {
    await updateFlats()
})

// лимит отображение
const limit = ref(5)
const flatsFixed = computed(() => {
    return flatsSearch.value.slice(0, limit.value);
});


</script>
<template>
    <div :class="{ none: isUserData !== 1 }" class="UsersWrapper">
        <SearchItem :items="flats" @update:items="val => flatsSearch = val" />

        <div v-for="flat in flatsFixed" style="display: flex; flex-direction: column; gap: 5px;">
            <div class="CatalogList" style="gap: 5px;">
                <RenderFlatCard :flat="flat" />
                <button @click="emit('fix:books', flat.id)">Бронированные дни по этой квартире</button>
            </div>
        </div>
        <b v-if="limit < flatsSearch.length" class="seeMore" @click="limit += 5">Показать ещё...</b>
    </div>
</template>

<style scoped>
.UsersWrapper {
    margin-top: 30px;
    margin-bottom: 30px;
    display: flex;
    flex-direction: column;

    gap: 20px;
}

.none {
    display: none;
}
</style>