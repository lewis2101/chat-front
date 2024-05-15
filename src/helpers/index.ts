import dayjs from 'dayjs'
export const formatTime = (date: string) => dayjs(new Date(date)).format('HH:mm')
