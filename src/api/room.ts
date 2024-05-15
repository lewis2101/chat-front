import {useFetch} from "@/composables/useFetch";

export const create = (payload: { name: string, password: string }) => useFetch().post('/create-room', payload)

export const getRoomTitle = (payload: { room: string }) => useFetch().post('/room', payload)

export const getUUID = (payload: { name: string, password: string }) => useFetch().post('/get-room', payload)
