import { defineStore } from 'pinia'

export const useTreeStore = defineStore({
  id: 'Tree',
  state: () => ({
    treeInfo: {
      cs: 0,
      ca: 0,
      cd: 0,
      cv: 0,
      DBH: 0,
      height: 0,
      id: 'Pending ID',
      x: 0,
      y: 0,
      lat: 'Pending ID',
      lng: 'Pending ID'
    },
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