<script setup>
import { ref, computed, onBeforeUnmount } from "vue";

// Данные для ползунка
const props = defineProps({
  min: Number,
  max: Number,
  step: { type: Number, default: 1000 },
  minValue: Number,
  maxValue: Number,
});

// Изменение Макс и Мин значений 
const emit = defineEmits(["update:minValue", "update:maxValue"]);

function updateMinEmit(v) {
  if (v > props.maxValue) v = props.maxValue - props.step;
  emit("update:minValue", v);
}
function updateMaxEmit(v) {
  if (v < props.minValue) v = props.minValue + props.step;
  emit("update:maxValue", v);
}


// Процентный расчет чтобы корректно отоброжалось макс мин кружки
const precent = (v) => (v - props.min) / (props.max - props.min) *100;

const leftPrcent = computed(() => precent(props.minValue));
const rightPrcent = computed(() => precent(props.maxValue));


// Чтобы переходил по указанному шагу
function clampStep(val) {
  return Math.round(val / props.step) * props.step;
}


// Данные о перемещение мыши и пальца
let active = null;

// мышь
function startM(e) {
  active = e.target;
  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopM);
}
// палец
function startP(e) {
  active = e.target;
  document.addEventListener("pointermove", onDrag);
  document.addEventListener("pointerup", stopP);
}


// Отследить слайд
function onDrag(e) {
  if (!active) return;
  const rect = active.parentElement.getBoundingClientRect();
  let x = e.clientX
  if(x > rect.right) x = rect.right
  if(x < rect.left) x = rect.left
  const ratio = (x - rect.left) / rect.width;
  let value = clampStep(props.min + ratio * (props.max - props.min));

  active.dataset.side == "left" ? updateMinEmit(value) : updateMaxEmit(value);
}


// Остоновить отслеживание
function stopM() {
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopM);
  active = null;
}
function stopP() {
  document.removeEventListener("pointermove", onDrag);
  document.removeEventListener("pointerup", stopM);
  active = null;
}


onBeforeUnmount(stopM, stopP);
</script>

<template>
  <div class="slider">
    <div class="track"></div>
    <div
      class="range"
      :style="{ left: leftPrcent + '%', width: rightPrcent - leftPrcent + '%' }"
    ></div>
    <div
      class="thumb left"
      data-side="left"
      :style="{ left: leftPrcent + '%' }"
      @mousedown="startM"
      @pointerdown="startP"
    ></div>
    <div
      class="thumb right"
      data-side="right"
      :style="{ left: rightPrcent + '%' }"
      @mousedown="startM"
      @pointerdown="startP"
    ></div>
  </div>
</template>

<style scoped>
.slider {
  position: relative;
  height: 30px;
  width: 100%;
  touch-action: none;
}

.track {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  height: 2px;
  background-color: #bebebe;
}

.range {
  position: absolute;
  top: 50%;
  z-index: 2;
  transform: translateY(-50%);
  height: 2px;
  background-color: #da3333;
}

.thumb {
  position: absolute;
  top: 50%;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  border: 2px solid #da3333;
  background-color: #fafafa;
  cursor: pointer;
}
.left {
  transform: translate(-100%, -50%);
}
.right {
  transform: translate(0, -50%);
}
</style>
