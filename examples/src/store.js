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

const commits = {
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

    const exists = new Set(state.assignee.map(a => a.name))
    state.assignee = [
      ...state.assignee,
      ...card.assignee
          .filter(name => !exists.has(name))
          .map(name => ({name, active: false}))
    ]
  },

  setActiveAssignee(state, assignee){
    const actives = new Set(assignee)
    state.assignee = state.assignee.map(a =>
      a.active === actives.has(a.name) ? 
          a : {...a, active: !a.active}
    )
  },

  removeCard(state, card) {
    state.cards = state.cards.filter(c => c.id !== card.id)

    const exists = new Set(state.cards
      .reduce((y, c) => [...y, ...c.assignee], []))
    state.assignee = state.assignee.filter(a => exists.has(a.name))
  },

  moveCard(state, cardId, status) {
    // use ==, cardId can be a string type
    const i = state.cards.findIndex(c => c.id == cardId)
    if(i < 0) return

    state.cards = [...state.cards]
    state.cards[i] = {...state.cards[i], status: status}
  }

}


export default new Skuol.Store({
  // 무결성을 해치지 않는 독립적인 데이터만 state에
  state: {
    cardSerial: 0,
    cards: [],
    assignee: []
  },
  /* actions can be omitted */
  commits
})


