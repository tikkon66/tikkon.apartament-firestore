<script setup>
import { ref } from "vue";

// Картины и alt для img
const props = defineProps({
  images: Array,
  altText: String,
});


// Индекс текщей картины
const index = ref(0);

// Изменение картины вперед и назад
function next() {
  index.value = (index.value + 1) % props.images.length;
}
function prev() {
  index.value = (index.value - 1 + props.images.length) % props.images.length;
}


// Отслеживать свайп
let active = false;
let startX = 0;

function start(e) {
  active = true;
  startX = e.clientX
  document.addEventListener("pointermove", touchMove)
  document.addEventListener("pointerup", stop);
} 

function touchMove(e) {
  if(!active) return
  let dif = e.clientX - startX
  if (dif > 50) {
    prev()
    stop()}
  else if (dif < -50){ 
    next() 
     stop();}
 
}

function stop() {
  document.removeEventListener("pointermove", touchMove)
  document.removeEventListener("pointerup", stop)
  active = false
}
</script>

<template>
  <div class="slider" v-if="images">
    <button class="nav left" @click="prev"></button>
    <img :src="images[index]" :alt="altText"  @pointerdown="start"/>
    <button class="nav right" @click="next"></button>

    <div class="dots">
      <div
        v-for="(img, i) in images"
        :class="{ active: i == index }"
        @click="index = i"
      >
      </div>
    </div>
  </div>
</template>

<style scoped>
.slider {
  position: relative;
  width: 100%;
  height: 100%;
  aspect-ratio: 4/3;
  overflow: hidden;
  touch-action: none;
}
.slider img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.63);
  border: none;
  padding: 15px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s;
  z-index: 2;
}

.nav.right {
  right: 12px;
}

.nav.left {
  left: 12px;
}

.nav:hover {
  background: rgba(231, 231, 231, 0.801);
  transform: scale(1.1);
}
.nav:active {
  transform: scale(1);
}

.nav::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 9px;
  height: 9px;
  border-top: 2px solid #222;
  border-right: 2px solid #222;
  transform: translate(-65%, -35%);
}

.left {
  transform: rotate(-135deg);
}
.left:hover {
  transform: rotate(-135deg) scale(1.1);
}
.left:active {
  transform: rotate(-135deg) scale(1);
}
.right {
  transform: rotate(45deg);
}
.right:hover {
  transform: rotate(45deg) scale(1.1);
}
.right:active {
  transform: rotate(45deg) scale(1);
}

.dots {
  position: absolute;
  bottom: 8px;
  left: 50%;
  width: 160px;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  gap: 7px;
  z-index: 1;
}

.dots div {
  width: 15px;
  height: 10px;
  background: rgba(231, 231, 231, 0.801);
  border-radius: 50px;
  cursor: pointer;
}

.dots .active {
  background-color:  rgba(255, 255, 255, 0.966);
}

@media (max-width: 1000px) {
  .nav {
    display: none;
  }
}
</style>
