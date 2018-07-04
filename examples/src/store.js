import Skuol from 'skuol'

export default new Skuol.Store({
  state: {
    counter: 0,
    todos: []
  },
  /* actions can be omitted */
  mutations: {
    addTodo(state, name){
      const item = {id: ++state.counter, name}
      state.todos = [...state.todos, item]
    },
    removeTodo(state, todo) {
      state.todos = state.todos.filter(t => t.id !== todo.id)
    }
  }
})


