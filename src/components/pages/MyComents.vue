<script setup>
import Footer from '../widgets/Footer.vue';
import Header from '../widgets/Header.vue';
import RatingRender from '../widgets/shared/RatingRender.vue'
import Confirm from '../widgets/shared/Confirm.vue';
import Toast from '../widgets/shared/Toast.vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { db, getComentsByFlatOrUser, getFlatById } from '../server';
import { deleteDoc, doc } from 'firebase/firestore';


// Данные
const route = useRoute()
const idUser = route.params.id;

const coments = ref([]);
const flats = ref([])
const ratings = computed(() => coments.value.map((e) => e.ratings))
const createdAt = computed(() => coments.value.map((e) => e.createdAt || false))

// Дата создание
const fixTime = computed(() => {
    return createdAt.value.map(item => {
        if (!item) return ""
        const date = item.toDate();
        return date.toLocaleString("ru-RU", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }).replace(",", " •");
    })
})


// прогрузка данных при рендере компонента
onMounted(async () => {
    coments.value = await getComentsByFlatOrUser(idUser, false)
    console.log(coments.value[0].idFlat)

    flats.value = await Promise.all(
        coments.value.map(e => getFlatById(e.idFlat))
    )
});


// путь на странницу кв
const router = useRouter();
function goToFlat(id) {
    router.push({ name: 'FlatPage', params: { id: id } })
}


// Удаление комента
async function deleteComent(id) {
    try {
        const docRef = doc(db, "coments", id);
        await deleteDoc(docRef)

        isOpenConfirm.value = -1
        AddTrigger.value++

        coments.value = await getComentsByFlatOrUser(idUser, false)
        console.log(coments.value[0].idFlat)

        flats.value = await Promise.all(
            coments.value.map(e => getFlatById(e.idFlat))
        )
    }
    catch (e) {
        isOpenConfirm.value = -1
        ErrorTrigger.value++
        console.log("didididi", e)
    }
}

// Для всплывающего окна и подтверждение
const isOpenConfirm = ref(-1)
const AddTrigger = ref(0)
const ErrorTrigger = ref(0);
</script>
<template>
    <Toast :trigger="AddTrigger" :text="'Удалено!'" />
    <Toast :trigger="ErrorTrigger" :text="'Не удалось удалить!'" :isErr="true" />
    <div class="container">
        <Header />
        <div class="wrapper">
            <div class="MyComentsWrapper">
            <h1 style="font-size: 35px; text-align: center;">Oтзывы:</h1>
                <div v-for="(flat, index) in flats" :key="index" class="Coment">
                    <hr class="horizontal">
                    <div style="display: flex; flex-direction: column; gap: 20px;">
                        <div class="userInfo">
                            <h2 class="userDesc">{{ flat?.name }}</h2>
                            <div class="RatingWrapper">
                                <RatingRender :info="ratings[index]" />
                                <span>{{ fixTime[index] }}</span>
                            </div>
                        </div>
                        <b> {{ coments[index]?.coments }}</b>
                    </div>
                    <div class="MyComentsButtons">
                        <button @click="goToFlat(flat.id)">Перейти к квартире</button>
                        <button style="background-color:#ca4e4e;" @click="isOpenConfirm = index">Удалить отзыв</button>
                        <Confirm v-if="isOpenConfirm == index" :text="'Подтвердите удаление отзыва'"
                            @doThis="deleteComent(coments[index].id)" @update:trigger="isOpenConfirm = -1" />

                    </div>
                </div>
            </div>
        </div>
        <Footer />
    </div>

</template>
<style scoped>
.container {
    display: flex;
    flex-direction: column;
    height: 100vh;

}

.MyComentsWrapper {
    flex: 1;
    color: #333;
    padding-top: 55px;
    padding-bottom: 45px;

    display: flex;
    flex-direction: column;
    gap: 20px;
}

.RatingWrapper {
    display: flex;
    align-items: center;
    gap: 10px;
}

.MyComentsButtons {
    display: flex;
    gap: 10px;

    margin-top: 20px;
}
</style>