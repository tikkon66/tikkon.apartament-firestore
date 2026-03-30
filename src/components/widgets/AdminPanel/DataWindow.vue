<script setup>
import { computed, ref } from 'vue'

// получение данных и функций
const emit = defineEmits(['update:data', 'close:window', 'doThis'])

const props = defineProps({
    message: String,
    isOpenDataForm: Boolean,
    flat: { type: Object, default: () => { } }
})
const message = computed(() => props.message)
const isOpenDataForm = computed(() => props.isOpenDataForm)

// данные кв
const origFlat = computed(() => props.flat)

const name = ref(origFlat?.value?.name || '')
const location = ref(origFlat?.value?.location || '')
const type = ref(origFlat?.value?.type || '')
const desc = ref(origFlat?.value?.desc || '')

const price = ref(origFlat?.value?.price || 0)
const bedrooms = ref(origFlat?.value?.info?.bedrooms || 0)
const guests = ref(origFlat?.value?.info?.guests || 0)
const beds = ref(origFlat?.value?.info?.beds || 0)
const square = ref(origFlat?.value?.info?.square || 0)

const floor = ref(origFlat?.value?.floor || [])
const images = ref(origFlat?.value?.images || [])

// для правил кв 
const rulesLen = ref(origFlat?.value?.rules?.length || 1)
const rules = ref(origFlat?.value?.rules || [])
function deleteRule() {
    rulesLen.value--
    rules.value.splice(rulesLen.value, 1)
}

// Данные кв в обьекте
const newFlat = computed(() => {
    return {
        name: name.value,
        location: location.value,
        type: type.value,
        desc: desc.value,
        price: price.value,
        info: {
            bedrooms: bedrooms.value,
            guests: guests.value,
            beds: beds.value,
            square: square.value
        },
        floor: floor.value,
        images: images.value,
        rules: rules.value,
    }
})


// скомпоновка функций
function doSomething() {
    console.log(newFlat.value)
    emit('update:data', newFlat.value)
    emit('doThis')
};

</script>
<template>
    <div class="FlatFormWrapper" :style="{ display: isOpenDataForm ? 'flex' : 'none' }">
        <div class="FlatForm">
            <div class="FormInfo">
                <div class="InfoInput">
                    <b>Название</b>
                    <input type="text" v-model="name">
                </div>
                <div class="InfoInput">
                    <b>Местоположение</b>
                    <input type="text" v-model="location">
                </div>
                <div class="InfoType">
                    <div class="InfoInput">
                        <b>Квартира</b>
                        <input type="text" v-model="type">
                    </div>
                    <div class="InfoPrice">
                        <b>Цена</b>
                        <input type="number" v-model="price">
                        <span class="currency">₸</span>
                    </div>
                </div>
            </div>

            <div class="vertical"></div>

            <div class="FormDesc">
                <div class="InfoInput">
                    <b>Описание</b>
                    <textarea v-model="desc"></textarea>
                </div>
            </div>

            <div class="vertical"></div>

            <div class="FormCharestic">
                <div class="ChInput">
                    <b>Этаж:</b>
                    <input type="number" v-model="floor[0]">
                    из
                    <input type="number" v-model="floor[1]">
                </div>

                <div class="ChInput">
                    <b>Спальни:</b>
                    <input type="number" v-model="bedrooms">
                </div>

                <div class="ChInput">
                    <b>Гости:</b>
                    <input type="number" v-model="guests">
                </div>

                <div class="ChInput">
                    <b>Кровати:</b>
                    <input type="number" v-model="beds">
                </div>

                <div class="ChInput">
                    <b>Площадь:</b>
                    <input type="number" v-model="square">
                    <span class="currency" style="top: 8px; right: -30px;">m2</span>
                </div>
            </div>

            <div class="vertical"></div>

            <div class="FormCount">
                <b>Картины</b>
                <div class="CountInput">
                    <span>1</span><input type="text" v-model="images[0]">
                </div>
                <div class="CountInput">
                    <span>2</span><input type="text" v-model="images[1]">
                </div>
                <div class="CountInput">
                    <span>3</span><input type="text" v-model="images[2]">
                </div>
                <div class="CountInput">
                    <span>4</span><input type="text" v-model="images[3]">
                </div>
                <div class="CountInput">
                    <span>5</span><input type="text" v-model="images[4]">
                </div>
                <div class="CountInput">
                    <span>6</span><input type="text" v-model="images[5]">
                </div>
            </div>

            <div class="vertical"></div>

            <div class="FormCount">
                <div class="RulesTitle">
                    <b>Правила</b>
                    <button @click="rulesLen++" style="border: 1px green solid;">Добавить</button>
                    <button @click="deleteRule">Убрать</button>

                </div>
                <div v-for="n in rulesLen" class="CountInput">
                    <span>{{ n }}</span><input type="text" v-model="rules[n - 1]">
                </div>

            </div>

            <div class="FormButtons">
                <button @click="doSomething">{{ message }}</button>
                <button v-on:click="$emit('close:window')">отменить</button>
            </div>
        </div>
    </div>
</template>
<style scoped>
.FormButtons {
    margin: 30px 0;
    display: flex;
    justify-content: center;

    gap: 5px;
}

.RulesTitle {
    display: flex;
    gap: 10px;
}

.RulesTitle button {
    font-size: 12px;

    font-size: small;
    color: #333;
    background-color: #ffffff61;
    border: red 1px solid;
}

.FormCount {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.CountInput {
    display: flex;
    align-items: center;
    gap: 5px;
}

.CountInput input {
    width: 100%;
}

.FormCharestic {
    flex-wrap: wrap;
    display: flex;
    gap: 20px;
    padding-right: 20px;
}

.ChInput {
    position: relative;

    display: flex;
    align-items: center;
    gap: 10px;
}

.ChInput input {
    width: 40px;
}

.currency {
    position: absolute;
    top: 50%;
    right: 5%;
}

.InfoPrice {
    position: relative;
    width: 20%;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.InfoPrice input {
    width: 80%;

}

.InfoType {
    display: flex;
    gap: 15px;
}

.FormInfo {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.InfoInput {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.InfoInput textarea {
    background-color: #a1a1a100;
    resize: vertical;
    min-height: 30px;

    color: #333;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
}

.vertical {
    width: 100%;
    border: 1px #a1a1a1 solid;
}

.FlatFormWrapper {
    color: #333;
    position: fixed;
    z-index: 4;
    height: 100vh;
    width: 100%;
    top: 0;
    left: 0;

    background-color: rgba(227, 227, 227, 0.539);

    display: flex;
    justify-content: center;
    align-items: center;

    padding: 20px;

}

.FlatForm {
    min-width: 70%;
    background-color: rgb(255, 255, 255);

    padding: 15px 20px;

    border-radius: 8px;
    border: 1px #b3b3b3 solid;

    height: 90vh;
    overflow-y: auto;

    display: flex;
    flex-direction: column;
    gap: 30px;

    position: relative;
}

.FlatForm::after {
    content: "";
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 30px;

    background: linear-gradient(to bottom,
            transparent,
            rgba(0, 0, 0, 0.5));

    pointer-events: none;
}
</style>