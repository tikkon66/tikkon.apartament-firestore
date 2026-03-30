<script setup>
import ExitIcon from '../shared/ExitIcon.vue'
import { computed, ref } from 'vue';

// получение данных и функций
const emit = defineEmits(['close'])

const props = defineProps({
    images: { type: Array, default: () => [] },
    currentInd: { type: Number, default: 0 }
})
const images = computed(() => props.images || [])
const currentInd = ref(props.currentInd)


// логика прокрутки картины
function prev() {
    const e = currentInd.value;
    currentInd.value = e <= 0 ? images.value.length - 1 : e - 1;
    console.log(currentInd.value, images.value.length - 1)
}
function next() {
    const e = currentInd.value;
    currentInd.value = e >= images.value.length - 1 ? 0 : e + 1;
    console.log(currentInd.value, images.value.lenght - 1)
}
function changeImage(num) {
    currentInd.value = num;
}


// переключение свайпом
let active = false;
let startX = 0;

function start(e) {
    active = true;
    startX = e.clientX
    document.addEventListener("pointermove", touchMove)
    document.addEventListener("pointerup", stop);
}

function touchMove(e) {
    if (!active) return
    let dif = e.clientX - startX
    if (dif > 50) {
        prev()
        stop()
    }
    else if (dif < -50) {
        next()
        stop();
    }

}

function stop() {
    document.removeEventListener("pointermove", touchMove)
    document.removeEventListener("pointerup", stop)
    active = false
}

</script>

<template>
    <div class="Player">
        <div style="justify-self: end; ">
            <ExitIcon @close="emit('close')" />

        </div>
        <div class="viewer">
            <div class="main-image">
                <button @click="prev">←</button>

                <img :src="images[currentInd]" alt="Квартира" @pointerdown="start" />

                <button @click="next">→</button>
            </div>
            <div class="thumbs">
                <img v-for="(img, i) in images" :key="i" :src="img" @click="changeImage(i)"
                    :class="{ active: i === currentInd }" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.Player {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 4;

    padding: 20px;

    width: 100%;
    height: 100vh;
    background-color: #626262ec;
}

.viewer {
    display: flex;
    flex-direction: column;

    justify-content: space-around;

    height: 90vh;
    padding: 20px;
}

.main-image {
    display: flex;

    gap: 10px;

    justify-content: center;
    align-items: center;
    max-height: 65vh;
    overflow: hidden;
    touch-action: none;
}

.main-image img {
    max-width: 700px;
    max-height: 500px;

    border-radius: 10px;
}

.thumbs {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 20px;
    overflow-x: auto;
}

.thumbs img {
    width: 100px;
    height: 80px;

    cursor: pointer;
    opacity: 0.6;
}

.thumbs img.active {
    opacity: 1;
    border: 2px solid red;
}

@media (max-width:900px) {

    .main-image button {
        display: none;
    }
}
</style>