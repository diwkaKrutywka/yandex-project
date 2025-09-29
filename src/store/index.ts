// stores/user.ts
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    iin: '' as string
  }),
  actions: {
    setIin(value: string) {
      this.iin = value
    },
    clearIin() {
      this.iin = ''
    }
  },
})
