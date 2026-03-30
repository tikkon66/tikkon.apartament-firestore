<script setup>
import Header from '../widgets/Header.vue'
import FlatInfo from '../widgets/FlatPage/FlatInfo.vue';
import Footer from '../widgets/Footer.vue'
import { useRoute } from 'vue-router';

const route = useRoute()
const id = route.params.id;

</script>

<template>
    <Header />
    <FlatInfo :id="id"/>
    <Footer/>
</template>

<style scoped></style>