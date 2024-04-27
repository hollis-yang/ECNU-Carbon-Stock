import { defineStore } from 'pinia'

export const useTreeStore = defineStore({
  id: 'Tree',
  state: () => ({
    treeInfo: null,
    selectedTree: null
  }),
  actions: {
    setTreeInfo(data) {
      this.treeInfo = data
    },
    setSelectedTree(data) {
      this.selectedTree = data
    }
  }
})