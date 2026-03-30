<script setup>
import Catalog from '../widgets/Home/Catalog.vue';
import Header from '../widgets/Header.vue';
import SearchSec from '../widgets/Home/SearchSec.vue';
import Footer from '../widgets/Footer.vue';
import { onMounted, ref } from 'vue';
import { getFlats } from '../server';


// Импорт квартир чтобы по компонентам связать
const flats = ref([])
onMounted(
    async () => {
        flats.value = await getFlats()
        flatsFix.value = flats.value
    })


// Отборные квартиры через поиск, филтры и сортировку
const flatsFix = ref([]);


</script>

<template>
    <Header />
    <SearchSec :flats="flats" @update:flats="val => flatsFix = val" />
    <Catalog :flats="flatsFix" :title="'Найдём, где остановиться в Алматы: 1 596 вариантов'"/>
    <Footer />
</template>

<style scoped></style>