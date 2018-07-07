import Skuol from '../../src'
import Todos from './Todos'


const store = new Skuol.Store({
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
    removeTodo(state, { todo }) {
      state.todos.filter(t => t !== todo)
    }
  }
})

const BoundTodos = Skuol.connect({
  select(state){ return state.todos }
})(Todos, store)

const App = Skuol.createComponent({
  onrender(){
    this.el.innerHTML = `
      <main>
        <div><!-- jsdom doesnt support form -->
          <fieldset>
            <label for='name'>Name:</label>
            <input id='name' name='name'>
          </fieldset>
          <button>Submit</button>
        </div>
        <div id='todos'>
        </div>
      </main>
    `

    this._components = { todos: new BoundTodos() }

    const todos = this.el.querySelector('#todos')
    todos.appendChild(this._components.todos.el)

    this.el.querySelector('button').addEventListener('click', () => {
      const name = this.el.querySelector('input[name=name]').value
      this.$store.dispatch('addTodo', name)
    })
  }
})

export default Skuol.connect()(App, store)
