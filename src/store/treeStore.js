import { defineStore } from 'pinia'

export const useTreeStore = defineStore({
  id: 'Tree',
  state: () => ({
    treeInfo: null
  }),
  actions: {
    setTreeInfo(data) {
      this.treeInfo = data
    }
  }
})