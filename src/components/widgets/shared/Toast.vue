<script setup>
import { ref, watch } from 'vue';

// получение данных
const { trigger, isErr, text } = defineProps({
    trigger: Number, 
    text: String,
    isErr: {type: Boolean, default: false} 
})

// Всплывающий механизм
const isShowToast = ref(false)

function showToast() {
    isShowToast.value = true;

    setTimeout(() => {
        isShowToast.value = false
    }, 3000)
}

watch(() => trigger, () => showToast());

</script>
<template>
    <div class="toast" :class="{ show: isShowToast, err: isErr}">
        {{ text }}
    </div>

</template>
<style scoped>
.toast {
    display: none;
    position: fixed;
    z-index: 5;
    top: -100%;
    left: 50%;
    transform: translateX(-50%);

    padding: 10px;
    background-color: #5aa84f;
    color: #f4f4f4;
    border-radius: 12px;

    transition: top 1s ease;
}

.err {
    background-color: #d54545;
}

.show {
    display: block;
    top: 40px;
}
</style>