<script setup>
import { computed, defineEmits, ref, toRaw, reactive } from 'vue';
import SearchItem from '../shared/SearchItem.vue';

// Данные всех квартир
const props = defineProps({
  flats: { type: Array, default: () => [] }
})
const flats = computed(() => props.flats || []);

const emit = defineEmits(["update:flats"]);
</script>

<template>
  <div class="SearchBg">
    <section class="SearchSec wrapper">
      <div class="SearchDesc">
        <h1>Снять квартиру в Алматы посуточно</h1>
        <h2>1 596 предложений в южной столице Казахстана</h2>
      </div>

      <SearchItem :items="flats" @update:items="val => $emit('update:flats', val)" />
    </section>
  </div>
</template>

<style scoped>
input {
  background-color: #fafafa;
  color: #333;
  border: none;
}

.SearchBg {
  background-image: url("../../../assets/Home/searchBg.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 70px 20px;
}

.SearchSec {
  align-items: center;
  padding: 20px;
}

.SearchDesc {
  background-color: rgba(37, 37, 37, 0.368);
  padding: 0 20px;
  border-radius: 10px;
  margin-bottom: 15px;
}

.SearchDesc>* {
  text-align: center;
  color: #fff;
}

h1 {
  margin: 20px;
}


.SearchMiniInputs {
  display: flex;
  gap: 5px;
}

@media (max-width: 1150px) {
  .SearchSec {
    max-width: 700px;
  }

  h1 {
    font-size: xx-large;
  }

  h2 {
    font-size: large;
  }

  .SearchInputs {
    flex-direction: column;
  }
}
</style>
