<script setup>
import { ref, computed, watch, watchEffect } from "vue";
import RangeSlider from "./RangeSlider.vue";

// Данные для фильтра
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  step: {
    type: Number,
    default: 1
  },
  symbol: {
    type: String,
    default: ""
  }
});

const data = computed(() => props.data || []);

const AbsoluteMin = computed(() => {
  return data.value.length ? Math.floor(Math.min(...data.value) / props.step) * props.step : 0;
});

const AbsoluteMax = computed(() => {
  return data.value.length ? Math.ceil(Math.max(...data.value) / props.step) * props.step : 0;
});


// мин значение и макс значение указатель
const minData = ref(AbsoluteMin.value);
const maxData = ref(AbsoluteMax.value);

// Изменение макс значение и мин значение ползунков при изменение квартир
watch(data, () => {
  minData.value = AbsoluteMin.value;
  maxData.value = AbsoluteMax.value;
});

// Чтобы мин значение не перешагнул через макс значение и наобарот
function normalizePrice() {
  minData.value = Math.max(AbsoluteMin.value, Math.min(minData.value, maxData.value - props.step));
  maxData.value = Math.min(AbsoluteMax.value, Math.max(maxData.value, minData.value + props.step));
}


// Эмит для изменение характеристик фильтра
const emit = defineEmits(["update:thumb"]);

watchEffect(() => {
  emit("update:thumb", [minData.value, maxData.value])
});
</script>


<template>
  <div class="slider">
    <div class="inputs">
      <div class="input-wrapper">
        <input type="number" v-model.number="minData" @change="normalizePrice" />
        <span class="currency"> {{ symbol }}</span>
      </div>
      <b> — </b>
      <div class="input-wrapper">
        <input type="number" v-model.number="maxData" @change="normalizePrice" />
        <span class="currency"> {{ symbol }}</span>
      </div>
    </div>

    <RangeSlider :min="AbsoluteMin" :max="AbsoluteMax" :step="step" v-model:minValue="minData"
      v-model:maxValue="maxData" />
  </div>
</template>
<style scoped>
.slider {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  width: 80%;
  margin: auto;
}

.inputs {
  display: flex;
  align-items: center;
  gap: 10px;
}

.inputs input {
  width: 70px;
}

.input-wrapper {
  position: relative;
}

.currency {
  position: absolute;
  top: 5px;
  right: 7px;
}
</style>
