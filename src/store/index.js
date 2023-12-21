
import { defineStore } from 'pinia'

export const useMain = defineStore('useStore', {
  state: () => {
    return {
      username: "", nickname: "", userId: '', 
      classStore: {
        classListStore: [],
        personListStore: []
      },
      drawStore: {
        classListStore: [],
        personListStore: []
      },
      isDrawing:false,
      classResult:[],
      teamCode:'',
      isAlowClear:true,
    }
  },

  actions: {

  },
})
