<script setup>

// получение функций
const emit = defineEmits(['close']);

</script>

<template>
    <div @click="emit('close')" class="exitWrapper">
        <div class="exit"></div>
    </div>
</template>

<style scoped>
.exitWrapper {
    width: 30px;
    margin: 3px;
}

.exit {
    margin: 0;
}

.exit::after {
    width: 30px;
    background-color: #fff;
}

.exit::before {
    width: 30px;
    background-color: #fff;
}
</style>