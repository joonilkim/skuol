import Skuol from '../../src'
import Todos from './Todos'
import store, { storeKey } from './store'

const BoundTodos = Skuol.connect({
  select(state){ return state.todos }
})(Todos, storeKey)

const App = Skuol.createComponent({
  oncreate({ dispatch }){
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

    const todos = this.el.querySelector('#todos')
    todos.appendChild(new BoundTodos().el)

    this.el.querySelector('button').addEventListener('click', () => {
      const name = this.el.querySelector('input[name=name]').value
      dispatch('addTodo', name)
    })
  }
})

export default Skuol.connect()(App, storeKey)

export { store }
