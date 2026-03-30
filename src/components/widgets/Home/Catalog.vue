<script setup>
import { ref, computed, onMounted, watch, reactive } from "vue";
import FlatFilter from "./FlatFilter.vue";
import FlatsFix from "./FlatsFix.vue";

// Загрузка квартир для каталоге 
const props = defineProps({
  flats: {type: Array, default: () => []},
  title: {type: String, default: ""}
})
const flats = computed(() => props.flats)

// Данные для фильтра
const prices = computed(() => flats.value.map((p) => p.price || 0));
const bedrooms = computed(() => flats.value.map((p) => p.info?.bedrooms || 0));
const square = computed(() => flats.value.map((p) => p.info?.square || 0));

const filter = reactive({
  bedrooms: [],
  price: [],
  square: [],
})


// Лимит отображение карточек квартир
const limit = ref(5);


// Значение сортировок
const sortPrice = ref(0);
const sortSquare = ref(0);

watch(sortPrice, (val) => {
  if (val > 0) sortSquare.value = 0;
});
watch(sortSquare, (val) => {
  if (val > 0) sortPrice.value = 0;
});

const sort = reactive({
  price: sortPrice,
  square: sortSquare,
});
</script>

<template>
  <section class="Catalog wrapper">
    <h2>{{ props.title }}</h2>
    <div class="CatalogContent">
      <div class="CatalogFilter Card">
        <div class="FilterWrapper">
          <b>Количество спальных-комнат</b>
          <FlatFilter :data="bedrooms" :step="1" :thumbs="filter.bedrooms"
            @update:thumb="val => filter.bedrooms = val" />
        </div>
        <div class="FilterWrapper">
          <b>Цена за сутки</b>
          <FlatFilter :data="prices" :step="1000" :symbol="'₸'" :thumbs="filter.price"
            @update:thumb="val => filter.price = val" />
        </div>
        <div class="FilterWrapper">
          <b>Площадь квартиры</b>
          <FlatFilter :data="square" :step="5" :symbol="'m2'" :thumbs="filter.square"
            @update:thumb="val => filter.square = val" />
        </div>

        <div class="FilterWrapper">
          <b>Сортировка по цене</b>
          <select name="Price" id="PriceSort" v-model="sortPrice">
            <option :value="0">Выбрать</option>
            <option :value="1">По убыванию</option>
            <option :value="2">По возрастанию</option>
          </select>
        </div>
        <div class="FilterWrapper">
          <b>Сортировка по площади сортирова</b>
          <select name="Square" id="SquareSort" v-model="sortSquare">
            <option :value="0">Выбрать</option>
            <option :value="1">По убыванию</option>
            <option :value="2">По возрастанию</option>
          </select>
        </div>
      </div>
      <FlatsFix :flats="flats" :filter="filter" :sort="sort" :limit="limit" @limit:up="limit+=5"/>
    </div>
  </section>
</template>

<style scoped>
.Catalog {
  color: #333;
}

.CatalogContent {
  display: flex;
  justify-content: start;
  gap: 30px;
}

.CatalogFilter {
  display: flex;
  flex-direction: column;
  gap: 30px;
  height: fit-content;
  padding: 20px;
  max-width: 300px;
}

.FilterWrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media (max-width: 1100px) {
  .CatalogContent {
    flex-direction: column;
    align-items: center;
    justify-content: start;
  }

  .CatalogFilter {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    height: fit-content;
    padding: 20px;
    max-width: 1000px;
  }

  .FilterWrapper {
    padding: 20px;
    width: 250px;
  }
}
</style>
