import { defineStore } from 'pinia'

export const useLegendStore = defineStore({
  id: 'Legend',
  state: () => ({
    showMap1: false,
    showMap2: false
  })
})