import { defineStore } from 'pinia'

export const useTreeStore = defineStore({
  id: 'Tree',
  state: () => ({
    treeInfo: {
      Carbon: 0,
      CrownArea: 0,
      CrownDiameter: 0,
      CrownVolume: 0,
      DBH: 0,
      TreeHeight: 0,
      TreeID: 'Pending ID',
      TreeLocationX: 0,
      TreeLocationY: 0,
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