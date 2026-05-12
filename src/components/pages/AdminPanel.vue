<script setup>
import FlatsList from '../widgets/AdminPanel/FlatsList.vue';
import ReserveList from '../widgets/AdminPanel/ReserveList.vue';
import UsersList from '../widgets/AdminPanel/UsersList.vue';
import Footer from '../widgets/Footer.vue';
import Header from '../widgets/Header.vue';
import { ref } from "vue";

// Анимация нижней линий при выборе
const activeTab = ref(0);

const underlineStyle = ref({
    left: "0px",
    width: "117px"
});

const isUserData = ref(0);

function setTab(index, event) {
    isUserData.value = index 
    activeTab.value = index;

    const el = event.target;

    underlineStyle.value = {
        left: el.offsetLeft + "px",
        width: el.offsetWidth + "px"
    };
}

</script>
<template>
    <div class="cont">
        <Header />
        <div class="adminWrapper" style="color: #333; ">
            <div class="Wrapper">
                <div class="UserOrFlat tabs">
                    <div class="tab" style="width: 97px;" :class="{ active: activeTab === 0 }"
                        @click="setTab(0, $event)">
                        Ползователи
                    </div>
                    <hr>
                    <div class="tab" :class="{ active: activeTab === 1 }" @click="setTab(1, $event)">
                        Квартиры
                    </div>
                    <hr>
                    <div class="tab" :class="{ active: activeTab === 2 }" @click="setTab(2, $event)">
                        Брони
                    </div>

                    <div class="underline" :style="underlineStyle"></div>
                </div>

                <UsersList :isUserData="isUserData" />
                <FlatsList :isUserData="isUserData" />
                <ReserveList :isUserData="isUserData" />
            </div>
        </div>

        <Footer />
    </div>
</template>
<style scoped>
.adminWrapper {
    padding: 0 20px;
    padding-top: 55px;
    flex: 1;
    display: flex;
    flex-direction: column;

    justify-content: start;
    align-items: center;
}

.tabs {
    justify-self: center;

    position: relative;
    display: flex;
    width: fit-content;
}

.tab {
    padding: 5px 10px;
    cursor: pointer;
    box-sizing: content-box;
}

.underline {
    position: absolute;
    bottom: 0;
    height: 1px;
    background: red;
    transition: all 0.3s ease;
}
</style>