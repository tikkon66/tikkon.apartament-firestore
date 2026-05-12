<script setup>
import { computed, onMounted, ref } from 'vue';
import { useAuth, db, getFlatReserves } from '../../server';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import Toast from '../shared/Toast.vue';
import Confirm from '../shared/Confirm.vue';
import AuthWindow from '../AuthWindow.vue';

// Цена квартиры
const { idFlat, price } = defineProps({
    idFlat: { type: String, default: "" },
    price: { type: Number, default: 0 }
})


// Функций для перевода в строку дату 
function toStringDate(d) {
    return d.toISOString().split("T")[0]
}


// Для обозначение дней заеда и выезда 
const today = new Date

const tommorow = new Date
tommorow.setDate(today.getDate() + 1);

const afterTommorow = new Date
afterTommorow.setDate(today.getDate() + 2);

const checkIn = ref(toStringDate(tommorow))
const checkOut = ref(toStringDate(afterTommorow))
function normOut() {
    if (checkIn.value >= checkOut.value) {
        const start = new Date(checkIn.value)
        start.setDate(start.getDate() + 1)
        checkOut.value = toStringDate(start)
    }
}

// Чтобы не кофликтовал заед и выезд
const minIn = toStringDate(tommorow);
const minOut = computed(() => {
    const fIn = new Date(checkIn.value)
    fIn.setDate(fIn.getDate() + 1)

    return toStringDate(fIn)
})


// Счет дней и цен
const nights = computed(() => {
    const start = new Date(checkIn.value)
    const end = new Date(checkOut.value)

    const diff = end - start;
    return diff / (1000 * 60 * 60 * 24)
})

const totalPrice = computed(() => {

    return nights.value * price
})


// для всплывающих окон
const isOpenConfirm = ref(false)
const AddTrigger = ref(0)
const ErrorTrigger = ref(0);

//  Получение брони кв
const reserves = ref({ liked: [] });
onMounted(async () => {
    reserves.value = await getFlatReserves(idFlat)
})

// Бронь квартиры
const authWindow = ref(false);
const { user, userData } = useAuth()
const busyIn = ref(false)

async function reserve() {
    if (!user) authWindow.value = true
    if (userData.value.role == 'ban') {
        isOpenConfirm.value = false
        ErrorTrigger.value += 1;
        return
    }

    reserves.value = await getFlatReserves(idFlat) || [];

    const flatRes = {
        start: checkIn.value,
        end: checkOut.value,
        createdAt: toStringDate(new Date())
    }
    const userRes = {
        idFlat: idFlat,
        start: checkIn.value,
        end: checkOut.value,
        createdAt: toStringDate(new Date()),
    }
    function isInReserve() {
        let isIn = false;
        reserves.value.liked.forEach(item => {
            if (new Date(flatRes.start) >= new Date(item.start) && new Date(flatRes.start) <= new Date(item.end)) {
                isIn = "Занято по " + item.start + " до " + item.end
            }
        });
        return isIn
    }
    busyIn.value = isInReserve()

    isOpenConfirm.value = false
    if (busyIn.value) {
        ErrorTrigger.value += 1;
        return
    }


    try {
        console.log("eeeee", idFlat)
        await updateDoc(doc(db, "reserves", idFlat), {
            liked: arrayUnion(flatRes)
        }
        )
        await updateDoc(doc(db, "usersPrivate", user.value.uid), {
            booked: arrayUnion(userRes)
        }
        )
        busyIn.value = false
        AddTrigger.value += 1

    } catch (e) {
        console.log(e, "epepepepeeppepepepe")
    }
}

</script>
<template>
    <AuthWindow v-if="authWindow" @close="authWindow = false" />
    <Toast :trigger="AddTrigger" :text="'Забронировано!'" />
    <Toast :trigger="ErrorTrigger" :text="'Не удалось заюронировать!'" :isErr="true" />
    <div class="BookWrapper infoWrapper">

        <div class="BookInputs">
            <div class="BookPriceWrapper">
                <span class="BookPrice">
                    {{ totalPrice }} ₸
                </span>

                <span class="BookDays">за {{ nights }} суток</span>
            </div>
            <div class="InputWrapper">
                <label for="checkIn">Заезд:</label>
                <input id="checkIn" type="date" v-model="checkIn" :min="minIn" @change="normOut">
            </div>
            <div class="InputWrapper">
                <label for="checkOut">Выезд:</label>
                <input id="checkOut" type="date" v-model="checkOut" :min="minOut">
            </div>
            <div class="InputWrapper">
                <label for="phoneNum">Номер телефона</label>
                <input class="BookNumber" type="number" name="" id="phoneNum" placeholder="Ваш номер">
            </div>
        </div>

        <button @click="isOpenConfirm = true">Забронировать</button>
        <Confirm v-if="isOpenConfirm" :text="'Подтвердите бронирование квартиры'" @doThis="reserve"
            @update:trigger="isOpenConfirm = false" />
        <span v-if="busyIn" style="margin: 0 20px; color: red;">{{ busyIn }}</span>
    </div>
</template>
<style scoped>
.InputWrapper {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(1);
    transform: scale(1.3);
    font-family: 'Courier New', Courier, monospace;
}

.BookPrice {
    color: rgb(144, 229, 17);
    font-size: 30px;
    line-height: normal;
}

.BookDays {
    font-weight: 500;
}

.BookPriceWrapper {
    display: flex;
    align-items: end;
    gap: 5px;
}

.BookWrapper {
    display: flex;
    flex-direction: column;
    gap: 30px;
    justify-content: center;
    align-items: center;
    padding: 20px 0;

    position: sticky;
    top: 70px;

}

.BookInputs {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: fit-content;
}

.BookTime {
    display: flex;
}

.BookTime input {
    width: 110px;
}

@media (max-width:1010px) {

    .BookPriceWrapper {
        gap: 5px;
        flex-direction: column;
        margin-right: 20px;
        align-items: center;
    }

}
</style>