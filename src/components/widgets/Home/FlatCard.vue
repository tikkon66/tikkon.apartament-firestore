<script setup>
import SliderImage from "./SliderImage.vue";
import Heart from "../shared/Heart.vue";
import { useRouter } from "vue-router";

// Данные по карточке квартиры
const { flat } = defineProps({
  flat: { type: Object, required: true },
});


// Переход на странницу по квартире
const router = useRouter();
function goToFlat(id) {
  router.push({ name: 'FlatPage', params: { id: id } })
}

</script>

<template>
  <div style="position: relative">
    <div class="Card Button">
      <div class="CardImage">
        <SliderImage :images="flat.images" :altText="flat.name" />
      </div>
      <div class="CardInfo" @click="goToFlat(flat.id)">
        <div class="InfoMain">
          <span>{{ flat.type }}</span>
          <h3 class="CardDesc">{{ flat.name }}</h3>
          <div class="CardCharacter">
            <span>{{ flat.info.guests }} гостей </span>
            <span>{{ flat.info.beds }} кроватей</span>
            <span>{{ flat.info.bedrooms }} спальных комнат</span>
            <span>{{ flat.info.square }} m2</span>
          </div>
          <span class="green">Выгодный вариант</span>
        </div>
        <span>{{ flat.location }}</span>
      </div>
      <hr class="horisontal" />
      <div class="CardPrice">
        <div class="Price">
          <b>{{ flat.price }} ₸ </b>
          <span> за сутки</span>
        </div>
      </div>
    </div>

    <Heart :idFlat="flat.id" />
  </div>
</template>

<style scoped>
.Card {
  border-radius: 5px;
  overflow: hidden;
  display: flex;
  height: 240px;
  max-width: 1000px;
  gap: 10px;
  box-shadow: 3px 3px 20px #c1c1c1;
}

.CardImage {
  max-width: 320px;
}

.CardInfo {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 7px;
  gap: 6px;
  width: 35%;
  height: 100%;
}

.InfoMain {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.CardDesc {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.CardCharacter {
  display: flex;
  gap: 15px;
  flex-direction: row;
  flex-wrap: wrap;
  line-height: 5px;
}

.CardCharacter span {
  white-space: nowrap;
}

.green {
  color: #61ad43;
}

.CardPrice {
  padding: 7px;
  padding-right: 20px;
  min-width: 100px;
  display: flex;
  flex-direction: column;
  align-items: end;
  justify-content: end;
  font-size: large;
}

.Price {
  display: flex;
  flex-direction: column;
}

@media (max-width: 1100px) {
  .Card {
    flex-direction: column;
    height: 530px;
  }

  .horisontal {
    width: 95%;
    height: 1px;
  }

  .CardImage {
    max-width: 100%;
    max-height: 250px;
  }

  .CardInfo {
    padding-left: 15px;
    width: 100%;
  }

  .CardDesc {
    -webkit-line-clamp: 1;
  }



  .CardPrice {
    padding-bottom: 15px;
  }

  .Price {
    flex-direction: row;
    gap: 10px;
  }
}
</style>
