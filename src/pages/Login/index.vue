<template>
  <div :class="$style.container">
    <form v-if="currentModal === 'menu'" :class="$style.form">
      <v-btn type="button" color="#2a3942" @click="currentModal = 'new'">Создать комнату</v-btn>
      <v-btn type="button" color="#2a3942" @click="currentModal = 'old'">Подключится</v-btn>
    </form>
    <form v-if="currentModal === 'old'" :class="$style.form" @submit.prevent="connectRoom">
      <div :class="$style.input">
        <input
            type="text"
            placeholder="Имя пользователя"
            v-model="name"
            :disabled="loading"
        />
      </div>
      <div :class="$style.input">
        <input
            type="text"
            placeholder="Название комнаты"
            v-model="nameRoom"
            :disabled="loading"
        />
      </div>
      <div :class="$style.input">
        <input
            type="password"
            placeholder="Пароль"
            v-model="password"
            :disabled="loading"
        />
      </div>
      <v-btn type="submit" color="#2a3942">Подключится</v-btn>
    </form>
    <form v-if="currentModal === 'new'" :class="$style.form" @submit.prevent="createRoom">
      <div :class="$style.input">
        <input
            type="text"
            placeholder="Имя пользователя"
            v-model="name"
            :disabled="loading"
        />
      </div>
      <div :class="$style.input">
        <input
            type="text"
            placeholder="Название комнаты"
            v-model="nameRoom"
            :disabled="loading"
        />
      </div>
      <div :class="$style.input">
        <input
            type="password"
            placeholder="Пароль"
            v-model="password"
            :disabled="loading"
        />
      </div>
      <v-btn
          type="submit"
          color="#2a3942"
          :loading="loading"
      >Создать комнату
      </v-btn>
      <v-btn
          type="submit"
          color="#2a3942"
          :loading="loading"
          @click="currentModal = 'menu'"
      >Назад
      </v-btn>
    </form>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {create, getUUID} from "@/api/room";
import {useRouter} from "vue-router";

const router = useRouter()

const currentModal = ref<'new' | 'old' | 'menu'>('menu')

const name = ref('')
const nameRoom = ref('')
const password = ref('')

const loading = ref(false)

const createRoom = async () => {
  loading.value = true
  try {
    const {data} = await create({
      name: nameRoom.value,
      password: password.value,
      username: name.value
    })
    router.push(`/main/${name.value}/${data.room}`)
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
}

const connectRoom = async () => {
  try {
    const { data } = await getUUID({ name: nameRoom.value, password: password.value })
    if(data.uuid) router.push(`/main/${name.value}/${data.uuid}`)
  }catch (e) {
    console.log(e)
  }
}

</script>

<style lang="scss" module>
@use '/src/styles/vairables' as *;

.container {
  background: $base-gray-2;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 1rem;
}

.form {
  width: 100%;
  max-width: 500px;
  border-radius: 8px;
  padding: 1.5rem;
  background: $base-gray;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input {
  width: 100%;
  height: 40px;
  color: black;

  input {
    background: $base-gray-2;
    border-radius: 8px;
    width: 100%;
    height: 100%;
    padding: 0 .5rem;
    outline: none;
    border: none;
  }
}

</style>
