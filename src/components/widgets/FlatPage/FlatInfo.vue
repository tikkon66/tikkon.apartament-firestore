<script setup>
import CalculateCom from './CalculateCom.vue';
import Heart from '../shared/Heart.vue'
import ImagePlayer from './ImagePlayer.vue';
import ComentsRender from './ComentsRender.vue';
import BookBLock from './BookBLock.vue';
import AddComent from './AddComent.vue';
import { getFlatById, getComentsByFlatOrUser, isAuthenticated, getUserById } from '../../server';
import { onMounted, ref, computed } from 'vue';

// айди квартиры
const { id } = defineProps({
    id: String
})

// найти квартиру по айди
const flat = ref(
    {
        id: "",
        images: [],
        type: "",
        name: "",
        info: { guests: 0, beds: 0, bedrooms: 0, square: 0 },
        location: "",
        price: 0,
        coments: [],
        ratings: [],
        desc: "",
        floor: [],
        rules: [],
    }
);

// прогрузка списка пользователя
const users = ref([{ avatar: "", name: "" }])

// коментарий по кв
const coments = ref([])

// прогрузка данных при рендере компонента
async function updateComents() {
    coments.value = await getComentsByFlatOrUser(id)
    users.value = await Promise.all(
        idUsers.value.map(id => getUserById(id))
    )
}
onMounted(async () => {
    flat.value = await getFlatById(id)
    await updateComents()
});

const idUsers = computed(() => coments.value.map((e) => e?.idUser))
const ratings = computed(() => coments.value.map((e) => e?.ratings))


// Открыт ли плеер картинок
const isOpenPlayer = ref(false);
const curentInd = ref(0)


// открыть плеер
function OpenPlayer(num) {
    isOpenPlayer.value = true;
    curentInd.value = num
}

</script>

<template>
    <section class="flatInfo wrapper">
        <div class=" InfoTitle">
            <div class="Title">
                <h1>{{ flat.name }}</h1>
                <CalculateCom :ratings="ratings" />
            </div>
            <div class="action">
                <button class="actionShare">
                    <img src="https://png.klev.club/uploads/posts/2024-05/png-klev-club-64go-p-podelitsya-znachok-png-20.png"
                        alt="Поделиться" />
                </button>
                <div style="margin-top: -10px; margin-right: -10px; position: relative; ">
                    <Heart :idFlat="flat.id" />
                </div>
            </div>
        </div>

        <div class="InfoImage">
            <div class="gallery">
                <img :src="flat.images[0]" alt="фото квартиры" class="left" @click="OpenPlayer(0)">
                <div class="right">
                    <img :src="flat.images[1]" alt="фото квартиры" class="top" @click="OpenPlayer(1)">
                    <div class="bottom">
                        <img :src="flat.images[2]" alt="фото квартиры" @click="OpenPlayer(2)">
                        <div class="allImage">
                            <img :src="flat.images[3]" alt="фото квартиры">
                            <div class="allImageText" @click="OpenPlayer(3)">
                                <div>3 фото ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ImagePlayer v-if="isOpenPlayer" @close="isOpenPlayer = false" :images="flat.images"
                :currentInd="curentInd" />
        </div>

        <div class="InfoMain">
            <div class="MainDesc">
                <div class="InfoDesc infoWrapper">
                    <h2>{{ flat.type }}</h2>
                    <div class="DescCharacter">
                        <div class="ChPoint">{{ flat.info.square }} м2</div>
                        <div class="ChPoint">гостей {{ flat.info.guests }}</div>
                        <div class="ChPoint">спальни {{ flat.info.bedrooms }}</div>
                        <div class="ChPoint">кроватей {{ flat.info.beds }}</div>
                        <div class="ChPoint">этаж {{ flat.floor[0] }} из {{ flat.floor[1] }}</div>
                    </div>
                    <p>
                        {{ flat.desc }}
                    </p>

                </div>

                <div class="InfoRules infoWrapper">
                    <h3>Правила проживания</h3>
                    <ul>
                        <li v-for="item in flat.rules">{{ item }}</li>
                    </ul>
                </div>
            </div>

            <div class="InfoBook">
                <BookBLock :price="flat.price" :idFlat="id"/>
            </div>
        </div>


        <div class="FlatComents infoWrapper">
            <div class="ComentsTitle">
                <h3>Отзывы</h3>
                <CalculateCom :ratings="ratings" />
            </div>
            <AddComent v-if="isAuthenticated" :idFlat="flat.id" @update:coments="updateComents()" />
            <ComentsRender :comentsData="coments" :users="users" />
        </div>
    </section>
</template>

<style scoped>
.DescCharacter {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
}

.DescCharacter div {
    background-color: rgb(244, 244, 244);
    padding: 3px 10px 6px 10px;
    border-radius: 20px;
}

.FlatComents {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.InfoDesc {
    min-height: 185px;
}

.ComentsTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;

    margin-top: 10px;
}

h1 {
    font-size: 30px;
}

h2 {
    margin: 0;
}

ul {
    padding-left: 20px;
    margin: 8px 0;
}

.flatInfo {
    display: flex;
    flex-direction: column;
    gap: 15px;

    padding-top: 80px;
    color: #333;
}

.InfoTitle {
    display: flex;
    justify-content: space-between;
}

.Title {
    max-width: 700px;

    display: flex;
    flex-direction: column;
    gap: 10px;
}

.actionShare {
    background-color: #fff;
    padding: 9px 8px 5px 8px;
    border: #333 solid 1px;
}


.InfoMain {
    display: flex;
    gap: 10px;
    justify-content: space-between;
    margin-top: -150px;
}



.MainDesc {
    display: flex;
    flex-direction: column;
    gap: 15px;
    min-width: 78%;
}

.InfoBook {
    min-width: 22%;
    position: relative;
}

.like {
    position: static;
}

.action img {
    width: 30px;
    height: 30px;
}

.InfoImage {
    margin-top: 30px;
}

.gallery {
    display: grid;
    grid-template-columns: 1.52fr 1fr;
    gap: 10px;
}

.gallery img {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    border-radius: 8px;
    transition: all 0.2s;
    cursor: pointer;
}

.right {
    display: grid;
    grid-template-rows: 1fr 1fr;
    gap: 10px;
}

.bottom {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

.gallery {
    aspect-ratio: 16 / 9;
}


.gallery img:hover {
    transform: scale(1.015);
}

.gallery img:active {
    transform: scale(1);
}

.allImage {
    position: relative;
    height: 49%;
    cursor: pointer;
}

.allImageText {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    display: flex;
    justify-content: center;
    align-items: center;

    height: 100%;
    width: 100%;

    background-color: #4e4e4e6b;
    border-radius: 8px;
}

.allImageText div {
    background-color: #4b4b4b;
    border-radius: 8px;
    padding: 7px 14px;
    color: #fff;
    transition: all 0.2s;
}

.allImage:hover .allImageText div {
    transform: scale(1.05);
}

.allImage:active .allImageText div {
    transform: scale(1);
}

@media (max-width:1010px) {
    .InfoMain {
        flex-direction: column;
        margin-top: 0px;
    }

    .MainDesc {
        width: 100%;
    }

    .InfoBook {
        width: 100%;
    }

    .right {
        display: none;
    }

    .gallery {
        display: block;
        gap: 10px;
    }

    .gallery img {
        width: 100%;
        aspect-ratio: 4 / 3;
        object-fit: cover;
        border-radius: 8px;
        transition: all 0.2s;
        cursor: pointer;
    }
}
</style>