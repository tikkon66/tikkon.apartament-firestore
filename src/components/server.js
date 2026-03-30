import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import {
  getFirestore,
  doc, collection,
  getDoc, getDocs,
  query, where,
  deleteDoc,
  addDoc
} from "firebase/firestore";
import { ref, computed } from "vue";
import { getAnalytics } from "firebase/analytics";
import { useRouter } from "vue-router";


// Подключение в Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDpalpKySBZjaTcgtcTUHXPrDe2yN_7osU",
  authDomain: "vue-pract69.firebaseapp.com",
  projectId: "vue-pract69",
  storageBucket: "vue-pract69.firebasestorage.app",
  messagingSenderId: "860445048211",
  appId: "1:860445048211:web:ef7c0e7bc8a0961cf67c66",
  measurementId: "G-N1WWHZ1NPH",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);


// Авторизован ли
const user = ref(null);
const userData = ref(null);
export function useAuth() {
  auth.onAuthStateChanged(async (u) => {
    user.value = u;
    if (u) {
      const docRef = doc(db, "users", u.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        userData.value = snap.data();
      } else {
        userData.value = null;
      }
    }
  });
  return { user, userData };
}

export function logout() {
  try {
    auth.signOut();
    window.location.href = "/"
  } catch (err) {
    console.log("niger", err);
  }
}

export const isAuthenticated = computed(() => user.value !== null);




// Загрузка приватных данных
export async function getPrivateData(id) {
  const docRef = doc(db, 'usersPrivate', id)
  const snapshot = await getDoc(docRef)

  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() }
  }
  else {
    console.log("uuddddddddddddра не найдена")
  }
}


// Получить данные всех пользователей       
export async function getUsersData() {
  const userCol = collection(db, 'users')
  const snapshot1 = await getDocs(userCol);

  const users = []
  for (const doc of snapshot1.docs) {
    if (doc.data().role == "admin") continue
    users.push({
      id: doc.id,
      ...doc.data()
    })
  }
  return users
}

export async function getUsersPrivateData() {

  const privateCol = collection(db, 'usersPrivate')
  const snapshot2 = await getDocs(privateCol);

  const privat = snapshot2.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))

  return privat
}



// Загрузить резервы
export async function getFlatReserves(id) {
  const docRef = doc(db, 'reserves', id)
  const snapshot = await getDoc(docRef)

  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() }
  }
  else {
    console.log("uuddddddddddddра не найдена")
  }
}


// Загрузить квартиры
export async function getFlats(archive = false) {
  let q
  if (archive) {
    q = collection(db, 'flats')
  }
  else {
    q = query(
      collection(db, 'flats'),
      where('archive', "==", false)
    )

  }
  const snapshot = await getDocs(q);

  const flats = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))

  return flats
}


// Длбавить квартиру
export async function addNewFlat(flat) {
  try {
    await addDoc(collection(db, 'flats'), flat)
  }
  catch (e) {
    console.log(e)
  }
}


// Загрузить квартиру по айди
export async function getFlatById(id) {
  if (!id) return
  const docRef = doc(db, "flats", id)
  const snapshot = await getDoc(docRef)

  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() }
  }
  else {
    console.log("Квартира не найдена")
  }
}


// Загрузить данные пользователя по айди для отображение комента
export async function getUserById(id) {
  const docRef = doc(db, "users", id);
  const snapshot = await getDoc(docRef)

  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() }
  }
  else {
    console.log("Ползователь не найден")
  }
}


// Получить коменты по айди кв или пользователя
export async function getComentsByFlatOrUser(id, isFlat = true) {
  const isId = isFlat ? "idFlat" : "idUser"
  const q = query(
    collection(db, "coments"),
    where(isId, "==", id)
  )
  try {
    const snapshot = await getDocs(q)
    const result = [];

    snapshot.docs.forEach((doc) => {
      result.push({ id: doc.id, ...doc.data() })
    })

    return result

  }
  catch (err) {
    console.log(err, "erereofmerom")
  }
}

