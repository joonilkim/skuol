import Skuol from '../../src'

export const storeKey = '$testStore'

export default new Skuol.Store({
  state: {
    counter: 0,
    todos: []
  },
  commits: {
    addTodo(state, name){
      state.todos = [...state.todos, {id: ++state.counter, name}]
    },
    removeTodo(state, { todo }) {
      state.todos = filter(t => t !== todo)
    }
  },
  storeKey
})


