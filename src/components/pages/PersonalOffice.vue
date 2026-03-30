<script setup>
import Header from "../widgets/Header.vue";
import Footer from '../widgets/Footer.vue';
import { useRouter } from "vue-router";
import { useAuth } from "../server";
import { computed } from "vue";


// Все пути
const router = useRouter();
function goToLiked() {
    router.push({ name: 'Favorite', params: { id: user.value?.uid } })
}
function goToBooked() {
    router.push({ name: 'Reserves', params: { id: user.value?.uid } })
}
function goToComents() {
    router.push({ name: 'MyComents', params: { id: user.value?.uid } })
}
function goToEditor() {
    router.push({ name: 'ProfileEditor', params: { id: user.value?.uid } })
}


// Данные юзера
const { user, userData } = useAuth();

// когда создано
const createDate = computed(() => {
    if (!userData.value?.createdAt) return "";

    const date = userData.value?.createdAt.toDate();

    return date.toLocaleString("ru-RU", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).replace(",", " •");
});


// Отображение статуса
const role = computed(() => {
    switch (userData.value?.role) {
        case 'ban':
            return 'Забанен'
        case 'mute':
            return 'Ограничен в отзыве'
        case 'user':
            return ''
    }

});

</script>
<template>
    <div class="cont">
        <Header />
        <div class="wrapper ProfileWrapper">
            <div class="Profile">
                <div class="ProfileDesc infoWrapper">
                    <img :src="userData?.avatar" alt="Ваш аватар">
                    <b>{{ userData?.name }}</b>
                    <span>{{ role }}</span>
                </div>

                <button class="ProfileButton" @click="goToEditor">
                    Редактировать
                </button>
            </div>

            <div class="MyActive infoWrapper">
                <h1>Мои действие на сайте</h1>

                <div class="ActiveWrapper">
                    <div class="Time Actives Button ">{{ createDate }}<span>на tikkon.apartaments</span></div>
                    <div class="Actives Button" @click="goToComents">Отзывы <img
                            src="https://png.klev.club/uploads/posts/2024-06/png-klev-club-muqr-p-znachok-kommentariya-png-6.png"
                            alt="Иконка действие" class="ActivesImage"></div>
                    <div class="Actives Button" @click="goToLiked">Избранные <img
                            src="https://cdn-icons-png.flaticon.com/256/158/158722.png " alt="Иконка действие"
                            class="ActivesImage"></div>
                    <div class="Actives Button" @click="goToBooked">Бронирование <img
                            src="https://cdn-icons-png.freepik.com/256/2311/2311908.png?semt=ais_white_label"
                            alt="Иконка действие" class="ActivesImage"></div>
                </div>
            </div>
        </div>

        <Footer />

    </div>
</template>
<style scoped>
.cont {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.ProfileWrapper {
    display: flex;
    gap: 7px;
    flex-direction: row;
    flex: 1;
    padding-top: 90px;

    color: #222;
}

.Profile {
    display: flex;
    flex-direction: column;
    gap: 7px;
    align-items: center;
}

.ProfileDesc {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
}

.ProfileDesc img {
    width: 120px;
}

.Profile button {
    width: 100%;

    color: #3c3c3c;
    background-color: #fff;
    border: 0.5px #969393 solid;
}

.MyActive {
    width: 500px;
    height: fit-content;
    padding: 20px 30px;
}

h1 {
    font-size: 30px;
}

.ActiveWrapper {
    margin-top: 20px;
    width: 90%;

    display: grid;
    grid-template-columns: 49% 49%;
    grid-template-rows: 50px 50px;
    grid-gap: 5px;

}

.Actives {
    display: flex;
    justify-content: space-between;
    align-items: center;

    color: #222;
    background-color: #fff;
    border: 0.5px #969393 solid;
    border-radius: 5px;

    padding: 10px;
    box-sizing: border-box;
}

.Time {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    font-size: 15px;

}

.Time span {
    font-size: 14px;
    color: #545454;
}

.ActivesImage {
    width: 20px;
}

@media (max-width:1010px) {
    .ActiveWrapper {
        grid-template-columns: 95%;
        grid-template-rows: 50px 50px 50px 50px;

    }

    .ProfileDesc img {
        width: 80px;
    }

    .MyActive {
        max-width: 300px;
        display: flex;
        flex-direction: column;
        
        align-items: center;

    }

    .ProfileWrapper {
        flex-direction: column;
    }

    .ProfileDesc {
        width: 100%;
    }
}
</style>