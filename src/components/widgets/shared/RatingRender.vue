<script setup>

// получение данных
const { info } = defineProps({
    info: { type: Number, default: 10 }
});

</script>
<template>
    <div class="rating" :class="{
        green: info >= 8,
        yellow: info >= 5 && info < 8,
        red: info < 5
    }">
        <div style="text-align: center;">{{ info }}</div>
    </div>
</template>
<style scoped>
.rating {
    width: fit-content;
    height: fit-content;
    border-radius: 20px;
    padding: 2px 10px 3px 10px;

    color: rgb(255, 255, 255);
}

.green {
    background-color: rgb(18, 179, 133);
}
.yellow {
    
    background-color: rgb(204, 187, 35);
}
.red {
    
    background-color: rgb(200, 78, 59);
}
</style>