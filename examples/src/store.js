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

export default new Skuol.Store({
  // 무결성을 해치지 않는 독립적인 데이터만 state에
  // 나머지는 filter에서 후처리
  state: {
    cardSerial: 0,
    cards: [],
    activeAssignee: []
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
        assignee: todo.assignee.split(',').map(x => x.trim())
      }
      state.cards = [...state.cards, card]
    },
    setActiveAssignee(state, assignee){
      state.activeAssignee = assignee
    },
    removeCard(state, card) {
      state.cards = state.cards.filter(t => t.id !== card.id)
    }
  },
  filter(state){
    const actives = new Set(state.activeAssignee)
    const hasAssignee = (card) => (
      !actives.size ||
      card.assignee.findIndex(a => actives.has(a)) >= 0
    )

    // all assignee
    const names = state.cards.reduce((y, c) =>
      [...y, ...c.assignee]
    , [])
    const assignee = [...new Set(names)]
      .sort(strcmp)
      .map(name => ({name, active: actives.has(name)}))

    return {
      ...state,
      assignee,
      activeCards: state.cards.filter(hasAssignee)
    }
  }
})


