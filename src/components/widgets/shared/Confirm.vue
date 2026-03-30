<script setup>

// получение данных и функций
const emit = defineEmits(['doThis', 'update:trigger']);

const {text} = defineProps({
    text: String
});

</script>
<template>
    <div class="confirmAddCom">
        <div class="ConfirmDesc">
            <b style="color: #333;">{{ text }}</b>
            <div class="ConfirmButtons">
                <button @click="$emit('doThis')">Подтвердить</button>
                <button @click="$emit('update:trigger')">Отмена</button>
            </div>

        </div>
    </div>

</template>
<style scoped>
.confirmAddCom {
    position: fixed;
    z-index: 5;
    top: 0%;
    left: 0;

    width: 100%;
    height: 100vh;

    background-color:#b1b1b1a8;

    display: flex;
    justify-content: center;
    align-items: center;
}

.ConfirmDesc {
    padding: 10px;
    background-color:  #ffffffd2;
    border-radius: 12px;

    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 10px;

}

.ConfirmButtons {
    display: flex;
    gap: 5px;
}
.ConfirmButtons button {
    min-width: 150px;
}

</style>