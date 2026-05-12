<script setup>
import SliderImage from '../Home/SliderImage.vue';

const {flat} = defineProps({
    flat: Object
});

</script>
<template>
    <div class="Card Button">
        <div class="CardImage">
            <SliderImage :images="flat?.images" :altText="flat?.name" />
        </div>
        <div class="CardInfo" @click="goToFlat(flat?.id)">
            <div class="InfoMain">
                <span>{{ flat?.type }}</span>
                <h3 class="CardDesc">{{ flat?.name }}</h3>
                <div class="CardCharacter">
                    <span>{{ flat?.info?.guests }} гостей {{ flat?.info?.beds }} кроватей
                    </span>
                    <span>
                        {{ flat?.info?.bedrooms }} спальных комнат
                        {{ flat?.info?.square }} m2</span>
                </div>
                <b class="red">{{ flat?.archive ? "В архиве" : "" }}</b>
            </div>
            <span>{{ flat?.location }}</span>
        </div>
        <hr class="horisontal" />
        <div class="CardPrice">
            <div class="Price">
                <b>{{ flat?.price }} ₸ </b>
                <span> за сутки</span>
            </div>
        </div>
    </div>
</template>
<style>
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
    gap: 2px;
}

.CardDesc {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.CardCharacter {
    display: flex;
    flex-direction: column;
}

.red {
    color: #d14141;
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

    .CardCharacter {
        flex-direction: row;
        flex-wrap: nowrap;
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