<script setup>
import { computed, defineEmits, ref, toRaw, reactive } from 'vue';

// Изменение подходящих 
const emit = defineEmits(["update:items"])

// Данные всех
const props = defineProps({
    items: { type: Array, default: () => [] }
})
const items = computed(() => props.items || [])


// Перевод в цельную строку для сравнений
const searchText = ref("")

function normalText(text) {
    return text.replace(/\s+/g, "").toLowerCase()
}
function getStr(e) {
    console.log(e?.name, e?.type)
    return [e?.desc || "", e?.location || "", e?.name || "", e?.type || "", e?.role || ""].map(normalText).join(" ")
}


// Отбор подходящих
const itemsFixed = computed(() => {
    const query = normalText(searchText.value)
    return reactive(
        items.value
            .filter(e => getStr(e).includes(query))
            .map(e => toRaw(e))
    )
});

</script>

<template>

    <div class="SearchBar">
        <input v-model="searchText" type="text" placeholder="Что ищете.." />

        <button @click="emit('update:items', itemsFixed)">Найти</button>
    </div>
</template>

<style scoped>
.SearchBar {
    display: flex;
    justify-content: center;
    width: 500px;
    gap: 5px;

    align-self: center;
}

.SearchBar button {
    background-color: #e72e2e;
    border-radius: 3px;
}

.SearchBar input {
    min-width: 100%;
    padding: 10px;
    border-radius: 3px;
}


@media (max-width: 1150px) {
    .SearchBar {
        max-width: 350px;
    }

    .SearchBar {
        flex-direction: column;
    }
}
</style>
