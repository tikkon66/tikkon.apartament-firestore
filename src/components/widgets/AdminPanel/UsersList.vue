<script setup>
import { computed, onMounted, ref } from 'vue';
import { getComentsByFlatOrUser, getUsersData, getUsersPrivateData } from '../../server';
import BanUser from './BanUser.vue';
import SearchItem from '../shared/SearchItem.vue';


// получение данных
const props = defineProps({
    isUserData: Number
})
const isUserData = computed(() => props.isUserData)

// получение данных юзеров
const users = ref([])
const privat = ref([])
const coments = ref([])

async function updateUsers() {
    users.value = await getUsersData()
}

onMounted(async () => {
    await updateUsers()
    usersFix.value = users.value
    privat.value = await getUsersPrivateData()

    for (const item of users.value) {
        const result = await getComentsByFlatOrUser(item.id, false)
        coments.value.push(result)
    }
})

// отобранные юзеры 
const usersFix = ref([])
const privatFix = computed(() => privat.value.filter(e => usersFix.value.some(user => user.id === e.id)))
const comentsFix = computed(() => usersFix.value.map(item => coments.value.filter((e) => item.id == e[0]?.idUser)))


// функция для нормализаций времени
function toString(item) {
    const date = item.toDate();
    return date.toLocaleString("ru-RU", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).replace(",", " •");
};

</script>
<template>
    <div :class="{ none: isUserData !== 0 }" class="UsersWrapper">
        <SearchItem :items="users" @update:items="val => usersFix = val" />

        <div v-for="(item, index) in usersFix" style="display: flex; flex-direction: column; gap: 5px;">
            <div class="UserInfoWrapper Button">
                <div class="UserNameWrapper">
                    <img :src="item.avatar" alt="Фото профиля">
                    |
                    <div class="UserRoleWrapper">
                        <b>{{ item.name }}</b>
                        <span>{{ item.role }}</span>
                    </div>
                </div>

                    <span>| {{ toString(item.createdAt) }}</span>

                <div class="StatisticWrapper">
                    <div class="Statistic">
                        <img src="https://png.klev.club/uploads/posts/2024-06/png-klev-club-muqr-p-znachok-kommentariya-png-6.png"
                            alt="Иконка действие" class="ActivesImage">
                        <span>{{ comentsFix[index]?.length }} |</span>
                    </div>
                    <div class="Statistic">
                        <img src="https://cdn-icons-png.flaticon.com/256/158/158722.png " alt="Иконка действие"
                            class="ActivesImage">
                        <span>{{ privatFix[index]?.liked?.length }} |</span>
                    </div>
                    <div class="Statistic">
                        <img src="https://cdn-icons-png.freepik.com/256/2311/2311908.png?semt=ais_white_label"
                            alt="Иконка действие" class="ActivesImage">
                        <span>{{ privatFix[index]?.booked?.length }}</span>
                    </div>
                </div>
            </div>
            <BanUser :user="item" @update:users="updateUsers" />
        </div>

    </div>
</template>
<style scoped>
.StatisticWrapper {
    display: flex;
    gap: 10px;
    align-items: center;
}

.Statistic {
    display: flex;
    gap: 5px;

    align-items: center;
}

.UsersWrapper {
    margin: 30px 0;
    display: flex;
    flex-direction: column;

    gap: 20px;
}

.UserInfoWrapper {
    display: flex;
    width: 500px;

    padding: 10px;
    border: 1px #bababa solid;
    border-radius: 8px;

    justify-content: space-between;
    align-items: center;

    cursor: pointer;
}

.UserNameWrapper {
    display: flex;
    gap: 10px;

    align-items: center;
}

.UserNameWrapper img {
    width: 40px;
}

.UserRoleWrapper {
    display: flex;
    flex-direction: column;
    line-height: normal;

    width: 60px;

}

.UserRoleWrapper span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

}

.ActivesImage {
    width: 20px;
}

.none {
    display: none;
}

@media (max-width:1010px) {

    .UserInfoWrapper {
        width: 100%;
        align-items: start;
        flex-direction: column;
        gap: 10px;

        padding: 10px;
        border: 1px #bababa solid;
        border-radius: 8px;

        justify-content: space-between;
        cursor: pointer;
    }

    .UserNameWrapper {
        display: flex;
        gap: 10px;

        align-items: center;
    }
}
</style>