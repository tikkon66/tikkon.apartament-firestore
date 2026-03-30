<script setup>
import Footer from '../widgets/Footer.vue';
import Header from '../widgets/Header.vue';
import Heart from '../widgets/shared/Heart.vue';
import SliderImage from '../widgets/Home/SliderImage.vue';
import Toast from '../widgets/shared/Toast.vue';
import Confirm from '../widgets/shared/Confirm.vue';
import { onMounted, ref, } from 'vue';
import { doc, updateDoc } from 'firebase/firestore';
import { useRoute, useRouter } from 'vue-router';
import { db, getFlatById, getFlatReserves, getPrivateData } from "../server";


// Данные юзера
const route = useRoute()
const id = route.params.id;

const privateData = ref({})
const flats = ref([])

onMounted(async () => {
    privateData.value = await getPrivateData(id);

    flats.value = await Promise.all(
        privateData.value.booked.map(item => getFlatById(item.idFlat))
    )
})


// Для нормализаций даты
function toStringDate(d) {
    if (!d) return
    return d.toDate().toISOString().split("T")[0]
}


// для сравненение с сегодня
function compareDate(d) {
    if (!d) return
    const is = new Date(d) <= new Date
    return !is
}


// Для всплывающих окон
const isOpenConfirm = ref(-1)
const AddTrigger = ref(0)
const ErrorTrigger = ref(0)

// Отменить бронь
async function cancelBook(ind) {
    const idFlat = privateData.value.booked[ind].idFlat

    let privateBook = [...privateData.value.booked]
    privateBook.splice(ind, 1)

    let flatData = await getFlatReserves(idFlat)
    let flatBook = flatData.liked || []
    flatBook.splice(ind + 1, 1)

    console.log(privateBook, flatBook)

    try {
        await updateDoc(doc(db, "reserves", idFlat), {
            liked: flatBook
        })

        await updateDoc(doc(db, "usersPrivate", id), {
            booked: privateBook
        })

        privateData.value.booked = privateBook

        flats.value = await Promise.all(
            privateBook.map(item => getFlatById(item.idFlat))
        )
        isOpenConfirm.value = -1
        AddTrigger.value++;

    } catch (e) {
        isOpenConfirm.value = -1
        ErrorTrigger.value++
        console.log(e, "ffffff")
    }
}


// Переход на странницу по квартире
const router = useRouter();
function goToFlat(id) {
    router.push({ name: 'FlatPage', params: { id: id } })
};

</script>
<template>
    <Toast :trigger="AddTrigger" :text="'Бронь отменено!'" />
    <Toast :trigger="ErrorTrigger" :text="'Не удалось отменить бронь!'" :isErr="true" />
    <div class="cont">

        <Header />
        <div class="wrapper" style="justify-content: start;align-items: start; padding: 0 10px;">
            <div class="CatalogList">
                <h1 style="font-size: 35px; text-align: start;">Брони:</h1>
                <div v-for="(flat, index) in flats">
                    <div class="ReserveWrapper" v-if="flat">
                        <div class="Card Button">
                            <div class="CardImage">
                                <SliderImage :images="flat.images" :altText="flat.name" />
                            </div>
                            <div class="CardInfo" @click="goToFlat(flat.id)">
                                <div class="InfoMain">
                                    <h3 class="CardDesc">{{ flat.name }}</h3>
                                    <div class="CardCharacter">
                                        <span>{{ flat.location }}</span>
                                        <span> Создано: {{ toStringDate(privateData?.booked[index]?.createdAt) }}</span>
                                        <span>Заезд: {{ privateData.booked[index]?.start }} </span>
                                        <span>Выезд: {{ privateData.booked[index]?.end }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button v-if="compareDate(privateData.booked[index]?.start)"
                            @click="isOpenConfirm = index">Отменить</button>
                        <Confirm v-if="isOpenConfirm == index" :text="'Подтвердите отмены брони'" @doThis="cancelBook(index)"
                            @update:trigger="isOpenConfirm = -1" />

                        <Heart :idFlat="flat.id" />
                    </div>

                </div>

            </div>
        </div>
        <Footer />
    </div>

</template>
<style scoped>
.ReserveWrapper {
    width: 900px;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.cont {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
}

.CatalogList {
    max-width: 900px;
    display: flex;
    flex-direction: column;
    padding: 20px;
    padding-top: 60px;

    display: flex;
    justify-content: start;
    align-items: start;


    color: #333;
}


.Card {
    border-radius: 5px;
    overflow: hidden;
    display: flex;
    height: 240px;
    max-width: 1000px;
    gap: 10px;

}

.CardImage {
    max-width: 320px;
}

.CardInfo {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 5px;
    gap: 6px;
    width: 60%;
    height: 100%;
}

.InfoMain {
    display: flex;
    flex-direction: column;
    height:100%;
    padding:10px 0 20px 0;
    justify-content: space-between;
    gap: 2px;
}

.CardDesc {
    width: 95%;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.CardCharacter {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.CardCharacter span{
    
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.green {
    color: #61ad43;
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
    .ReserveWrapper {
        max-width: 300px;
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .CatalogList {
        max-width: 400px;
        display: flex;
        flex-direction: column;
        padding: 20px;
        padding-top: 60px;

        display: flex;
        justify-content: start;
        align-items: start;


        color: #333;
    }

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


    .CardPrice {
        padding-bottom: 15px;
    }

    .Price {
        flex-direction: row;
        gap: 10px;
    }
}
</style>