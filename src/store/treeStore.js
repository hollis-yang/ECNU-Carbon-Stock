import { defineStore } from 'pinia'

export const useTreeStore = defineStore({
  id: 'Tree',
  state: () => ({
    treeInfo: {
      Carbon: 0,
      CrownArea: 0,
      CrownDiameter: 0,
      CrownVolumn: 0,
      DBH: 0,
      TreeHeight: 0,
      TreeID: 'Pending',
      TreeLocationX: 0,
      TreeLocationY: 0,
      lat: 'Pending',
      lng: 'Pending'
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