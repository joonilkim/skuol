import Skuol from 'skuol'
import store from '../store'
import Todos from './Todos'

export default Skuol.createComponent({
  onrender(components){
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
    components.todos = components.todos || new Todos()

    const todos = this.el.querySelector('#todos')
    todos.appendChild(components.todos.el)

    this.el.querySelector('button').addEventListener('click', () => {
      const name = this.el.querySelector('input[name=name]').value
      store.dispatch('addTodo', name)
    })

    return components
  }
})
