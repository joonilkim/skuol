import Skuol from 'skuol'
import { strcmp } from './utils'


const TODO = 0
const INPROGRESS = 1
const DONE = 2

export {
  TODO,
  INPROGRESS,
  DONE
}

const filterAssignee = function(cards, activeNames){
  const names = cards.reduce((y, c) =>
      [...y, ...c.assignee]
    , [])
  return [...new Set(names)]
    .sort(strcmp)
    .map(name => ({name, active: activeNames.has(name)}))
}

export default new Skuol.Store({
  // 무결성을 해치지 않는 독립적인 데이터만 state에
  state: {
    cardSerial: 0,
    cards: [],
    assignee: []
  },
  /* actions can be omitted */
  mutations: {

    addTodo(state, todo){
      const id = state.cardSerial++
      const card = {
        ...todo, 
        id, 
        sortKey: Date.now(), 
        status: TODO,
        assignee: [...new Set(todo.assignee.split(',').map(x => x.trim()))]
      }
      state.cards = [...state.cards, card]

      const activeNames = state.assignee
        .filter(a => a.active)
        .map(a => a.name)
      state.assignee = filterAssignee(state.cards, new Set(activeNames))
    },

    setActiveAssignee(state, assignee){
      state.assignee = filterAssignee(state.cards, new Set(assignee))
    },

    removeCard(state, card) {
      state.cards = state.cards.filter(t => t.id !== card.id)

      const activeNames = state.assignee
        .filter(a => a.active)
        .map(a => a.name)
      state.assignee = filterAssignee(state.cards, new Set(activeNames))
    },

    moveCard(state, cardId, status) {
      const toMove = state.cards.find(c => c.id == cardId)
      toMove.status = status
    }

  }
})


