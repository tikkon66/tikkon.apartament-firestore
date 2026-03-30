+<script setup>
import RatingRender from '../shared/RatingRender.vue'
import { computed } from 'vue';


// данные отзывов
const { ratings } = defineProps({
    ratings: { type: Array, default: () => [] }
})
const CountCom = computed(() => ratings.length)

// средняя оценка
const rating = computed(() => {
    if (!ratings.length) return 10

    const summ = ratings.reduce((acc, val) => acc + val, 0)
    return (summ / ratings.length).toFixed(1)
});


</script>

<template>
    <div class="ratingWrapper">
        <RatingRender :info="+rating"/>        
        <div>{{ CountCom }} отзывов</div>
    </div>
</template>

<style scoped>
.ratingWrapper {
    display: flex;
    gap: 5px;

    align-items: center;

    font-weight: 600;
}

</style>