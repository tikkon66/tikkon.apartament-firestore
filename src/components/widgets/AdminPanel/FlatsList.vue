<script setup>
import SliderImage from '../Home/SliderImage.vue';
import SearchItem from '../shared/SearchItem.vue';
import AddFlat from './AddFlat.vue';
import ChangeFlat from './ChangeFlat.vue';
import { useRouter } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import { getFlats } from '../../server';


// получение данных
const props = defineProps({
    isUserData: Boolean
})
const isUserData = computed(() => props.isUserData)


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


// путь до кв
const router = useRouter();
function goToFlat(id) {
    router.push({ name: 'FlatPage', params: { id: id } })
};

</script>
<template>
    <div :class="{ none: isUserData }" class="UsersWrapper">
        <SearchItem :items="flats" @update:items="val => flatsSearch = val" />
        <AddFlat @update:flats="updateFlats()" />
        <div v-for="flat in flatsFixed" style="display: flex; flex-direction: column; gap: 5px;">
            <div class="CatalogList">
                <div class="Card Button">
                    <div class="CardImage">
                        <SliderImage :images="flat?.images" :altText="flat?.name" />
                    </div>
                    <div class="CardInfo" @click="goToFlat(flat?.id)">
                        <div class="InfoMain">
                            <span>{{ flat?.type }}</span>
                            <h3 class="CardDesc">{{ flat?.name }}</h3>
                            <div class="CardCharacter">
                                <span>{{ flat?.info?.guests }} гостей {{ flat?.info?.beds }} кроватей
                                </span>
                                <span>
                                    {{ flat?.info?.bedrooms }} спальных комнат
                                    {{ flat?.info?.square }} m2</span>
                            </div>
                            <b class="red">{{ flat?.archive ? "В архиве" : "" }}</b>
                        </div>
                        <span>{{ flat?.location }}</span>
                    </div>
                    <hr class="horisontal" />
                    <div class="CardPrice">
                        <div class="Price">
                            <b>{{ flat?.price }} ₸ </b>
                            <span> за сутки</span>
                        </div>
                    </div>
                </div>
                <ChangeFlat :flat="flat" @update:flats="updateFlats()" />
            </div>
        </div>
        <b v-if="limit < flatsSearch.length" class="seeMore" @click="limit += 5">Показать ещё...</b>
    </div>
</template>
<style scoped>
.CatalogList {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.seeMore {
    text-align: center;
    cursor: pointer;
    text-decoration: underline;
}

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

.Card {
    border-radius: 5px;
    overflow: hidden;
    display: flex;
    height: 240px;
    max-width: 1000px;
    gap: 10px;
    box-shadow: 3px 3px 20px #c1c1c1;
}

.CardImage {
    max-width: 320px;
}

.CardInfo {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 7px;
    gap: 6px;
    width: 35%;
    height: 100%;
}

.InfoMain {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.CardDesc {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.CardCharacter {
    display: flex;
    flex-direction: column;
}

.red {
    color: #d14141;
}

.CardPrice {
    padding: 7px;
    padding-right: 20px;
    min-width: 100px;
    display: flex;
    flex-direction: column;
    align-items: end;
    justify-content: end;
    font-size: large;
}

.Price {
    display: flex;
    flex-direction: column;
}

@media (max-width: 1100px) {
    .Card {
        flex-direction: column;
        height: 530px;
    }

    .horisontal {
        width: 95%;
        height: 1px;
    }

    .CardImage {
        max-width: 100%;
        max-height: 250px;
    }

    .CardInfo {
        padding-left: 15px;
        width: 100%;
    }

    .CardDesc {
        -webkit-line-clamp: 1;
    }

    .CardCharacter {
        flex-direction: row;
        flex-wrap: nowrap;
    }

    .CardPrice {
        padding-bottom: 15px;
    }

    .Price {
        flex-direction: row;
        gap: 10px;
    }
}
</style>