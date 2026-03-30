<script setup>
import { computed } from 'vue';
import RatingRender from '../shared/RatingRender.vue';


// получение данных
const { comentsData, users } = defineProps({
    comentsData: { type: Array, default: () => [] },
    users: { type: Array, default: () => [] }
})
const usersFix = computed(() => users || [])
const coments = computed(() => comentsData.map((e) => e.coments))
const ratings = computed(() => comentsData.map((e) => e.ratings))
const createdAt = computed(() => comentsData.map((e) => e.createdAt || false))
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
});

</script>

<template>
    <div class="ComentsWrapper">
        <div v-for="(item, index) in ratings" :key="index" class="Coment">
            <hr class="horizontal">
            <div>
                <div class="userInfo">
                    <div class="userDesc">
                        <img :src="usersFix[index]?.avatar" alt="Аватар пользователя">
                        <b>{{ usersFix[index]?.name }}</b>
                    </div>
                    <div class="RatingWrapper">
                        <RatingRender :info="item" />
                        <span>{{ fixTime[index] }}</span>
                    </div>
                </div>
                <p> {{ coments[index] }}</p>
            </div>
        </div>
    </div>
</template>
<style scoped>
.RatingWrapper {
    display: flex;
    gap: 5px;
    align-items: center;
}

.Coment {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.horizontal {
    background-color: #333;
    width: 99%;
    min-height: 1px;
}

.userInfo {
    display: flex;
    gap: 30px;
    align-items: center;
}

.userDesc {
    display: flex;
    gap: 10px;

    align-items: center;
}

.userDesc img {
    width: 40px;
    height: 40px;
}
</style>