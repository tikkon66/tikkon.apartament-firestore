<script setup>
import Footer from '../widgets/Footer.vue';
import Header from '../widgets/Header.vue';
import Catalog from '../widgets/Home/Catalog.vue';
import { onMounted, ref } from 'vue';
import { getFlatById, getPrivateData } from "../server";
import { useRoute } from 'vue-router';

// Данные любимых кв и юзера
const flats = ref([])
const route = useRoute()
const idUser = route.params.id;
const privateData = ref({})

onMounted(async () => {
    privateData.value = await getPrivateData(idUser);

    flats.value = await Promise.all(
        privateData.value.liked.map(id => getFlatById(id))
    )
});

</script>
<template>
    <Header />
    <div style="padding-top: 40px;">
        <Catalog :flats="flats" :title="'Избранных всего: ' + flats.length"/>
    </div>
    <Footer />

</template>
<style scoped></style>