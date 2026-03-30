<script setup>
import FlatCard from './FlatCard.vue'
import { computed } from "vue";

// Данные квартир, филтров и сортировок
const props = defineProps({
  flats: { type: Array, default: () => [] },
  filter: {
    type: Object,
    default: () => ({
      bedrooms: [],
      price: [],
      square: [],
    }),
  },
  sort: {
    type: Object,
    default: () => ({
      price: 0,
      square: 0,
    }),
  },
  limit: { type: Number, default: 5 },
});

const flats = computed(() => props.flats || []);

const filterBedrooms = computed(() => props.filter.bedrooms || []);
const filterPrice = computed(() => props.filter.price || []);
const filterSquare = computed(() => props.filter.square || []);

const sortPrice = computed(() => props.sort.price || 0);
const sortSquare = computed(() => props.sort.square || 0);

const limit = computed(() => props.limit || 5);


// Изменение лимита отображение квартир
const emit = defineEmits(["limit:up"]);


// Просеить подходящих квартир
const flatsFilter = computed(() => {
  return flats.value.filter((p) => {
    return (
      ((p.price >= filterPrice.value[0] && p.price <= filterPrice.value[1])) &&
      ((p.info.bedrooms >= filterBedrooms.value[0] &&
        p.info.bedrooms <= filterBedrooms.value[1])) &&
      ((p.info.square >= filterSquare.value[0] &&
        p.info.square <= filterSquare.value[1]))
    );
  });
});


// Отсортировка квартир
const flatsSort = computed(() => {
  const arr = [...flatsFilter.value];

  if (sortPrice.value == 1) {
    arr.sort((a, b) => a.price - b.price);
  } else if (sortPrice.value == 2) {
    arr.sort((a, b) => b.price - a.price);
  } else if (sortSquare.value == 1) {
    arr.sort((a, b) => a.info.square - b.info.square);
  } else if (sortSquare.value == 2) {
    arr.sort((a, b) => b.info.square - a.info.square);
  }
  return arr;
});


// Финальная сборка квартир которая подходит
const flatsFixed = computed(() => {
  return flatsSort.value.slice(0, limit.value);
});

</script>

<template>
  <div class="CatalogList">
    <FlatCard v-for="(item, index) in flatsFixed" :key="index" :flat="item" />
    <b v-if="limit < flats.length" class="seeMore" @click="$emit('limit:up')">Показать ещё...</b>
  </div>

</template>

<style>
.CatalogList {
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding-bottom: 30px;
}
.seeMore {
  text-align: center;
  cursor: pointer;
  text-decoration:underline ;
}
</style>
