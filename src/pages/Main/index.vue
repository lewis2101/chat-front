<template>
  <div :class="$style.wrapper">
    <div :class="$style.header">
      <div style="display: flex; gap: 1rem">
        {{ title }}
        <div v-for="(item, idx) in users" :key="idx" :class="$style['header-user']">
          <div :class="[
            { [$style.online]: item.status === 'online',
            [$style.offline]: item.status === 'offline'
            }
        ]"></div>
          {{ item.name }}
        </div>
      </div>
      <v-btn color="red" @click="logout">Выйти</v-btn>
    </div>
    <div :class="$style.chat">

      <div
          v-for="item in messages"
          :key="item.date"
          :class="[{
          [$style.companion]: item.from !== user,
          [$style.user]: item.from === user,
          [$style.admin]: item.from === 'admin'
        }]"
      >
        {{ item.text }}
        <div v-if="item.from !== 'admin'" :class="$style.time">
          {{ formatTime(item.date) }}
        </div>
        <v-icon
            v-if="item.from === user && item.status === 'send'"
            icon="mdi-check-all"
            size="15px"
            :class="$style.sended"
        />
        <v-icon
            v-if="item.from === user && item.status === 'read'"
            icon="mdi-check-all"
            size="15px"
            :class="$style.readed"
        />
        <v-icon
            v-if="item.from === user && item.status === 'save'"
            icon="mdi-check"
            size="15px"
            :class="$style.save"
        />
      </div>

    </div>
    <form :class="$style['text-field']" @submit.prevent="sendMessage">
      <div :class="$style.input">
        <input
            v-model="model"
            type="text"
            placeholder="Введите сообщение"
        />
      </div>
      <v-icon icon="mdi-send" :class="$style['send-icon']"/>
    </form>
  </div>
</template>

<script setup>
import io from 'socket.io-client'
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {formatTime} from "../../helpers";
import {getRoomTitle} from "../../api/room";

const router = useRouter()

const {user, room} = useRoute().params
const users = ref([])
const title = ref('')
const messages = ref([])
const model = ref('')

const socket = io.connect('http://localhost:8080')

socket.on('getHistory', data => {
  messages.value = data
})

socket.on('getMessage', data => {
  messages.value.push(data)
})

socket.on('status', data => {
  if(!data.name) return
  users.value = [data]
})

socket.on('new-user', data => {
  console.log(data)
})

const sendMessage = () => {
  socket.emit('message', {
    room,
    text: model.value,
    from: user
  })
  model.value = ''
}

const getTitle = async () => {
  try {
    const {data} = await getRoomTitle({room: room.toString()})

    title.value = data.title
    users.value = data.users
        .filter(i => i.name !== user.toString())
  } catch (e) {
    router.push('/')
  }
}

const logout = () => {
  socket.disconnect()
  router.push('/')
}

onMounted(async () => {
  try {
    await getTitle()
    socket.emit('join', {user, room})
    socket.emit('history', {user, room})
  } catch (e) {
    console.log(e)
  }
})


</script>

<style lang="scss" module>
@use '/src/styles/vairables' as *;

.wrapper {
  width: 100%;
  height: 100%;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.header {
  width: 100%;
  height: 10vh;
  background: $base-gray;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0 1rem;
  font-size: 24px;

  &-user {
    display: flex;
    align-items: center;
    gap: 5px;
  }
}

.online, .offline {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.online {
  background: green;
}

.offline {
  background: red;
}

.chat {
  width: 100%;
  height: 80vh;
  overflow: auto;
  background: $base-gray-2;
  padding: 1rem;

  display: flex;
  flex-direction: column;
  gap: 3px;


  .companion {
    background: $base-gray;
    padding: 5px 10px;
    width: fit-content;
    border-radius: 8px 8px 8px 0;
    display: flex;
    gap: 10px;
  }

  .user {
    background: $base-green;
    padding: 5px 10px;
    width: fit-content;
    border-radius: 8px 8px 0 8px;
    align-self: end;
    display: flex;
    gap: 10px;
  }

  .admin {
    background: $base-green;
    padding: 5px 10px;
    width: fit-content;
    border-radius: 8px;
    align-self: center;
    display: flex;
    gap: 10px;
  }
}

.time {
  font-size: 12px;
  align-self: end;
}

.text-field {
  width: 100%;
  height: 10vh;
  background: $base-gray;
  display: flex;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
}

.input {
  width: 100%;
  height: 100%;
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

.send-icon {
  cursor: pointer;
}

.sended, .save, .readed {
  align-self: end;
}

.readed {
  color: deepskyblue;
}
</style>
