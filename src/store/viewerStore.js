import { defineStore } from 'pinia'

export const useViewerStore = defineStore({
  id: 'Viewer',
  state: () => ({
    cesiumViewer: null
  }),
  actions: {
    setCesiumViewer(viewer) {
      this.cesiumViewer = viewer
    }
  }
})