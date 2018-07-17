# Skuol

A lightweight state container for native DOM

## Build
    npm run build

## Example

### Hello World

```js
const App = Skuol.createComponent({
  oncreate(){
    this.el.innerHTML = `<h2>Hello Skuol!</h2>`
  }
})

document.querySelector('body').appendChild(new App().el)
```

### Todo List - The Simplest Store

```js
const store = new Skuol.Store({
  state: {
    counter: 0,
    todos: []
  },
  commits: {
    addTodo(state, name){
      state.todos = [
        ...state.todos, 
        {id: state.counter++, name}
      ]
    },
    removeTodo(state, { todo }) {
      state.todos = filter(t => t !== todo)
    }
  }
})
```

### Todo List - Creating Components

```js
const Card = Skuol.createComponent({
  tagName: 'li',
  onrender(){
    this.el.innerHTML = `${this.model.name}`
  }
})

const CardList = Skuol.createCollection({
  tagName: 'ul',
  component: Card
})
```

### Todo List - Connecting the Component and the Store

```js
Skuol.install(store)

const TodoList = Skuol.connect()(new CardList())

const App = Skuol.createComponent({
  oncreate(){
    this.el.innerHTML = `
      <h2>Hello Skuol!</h2>
      <div id='todos'></div>
    `

    this.el.querySelector('#todos').appendChild(new TodoList().el)
  }
})

document.querySelector('body').appendChild(app.el)
```

### Todo List - Dispatching Actions

```js
const App = Skuol.createComponent({
  oncreate(){
    this.el.innerHTML = `
      <h2>Hello Skuol!</h2>
      <form>
        <label for='name'>Name:</label>
        <input id='name' name='name' required>
        <button type='submit'>Create</button>
      </form>
      <div id='todos'></div>
    `

    this.el.querySelector('#todos').appendChild(new TodoList().el)
    this.el.querySelector('form').addEventListener('submit', e => {
      e.preventDefault()
      const name = this.el.querySelector('#name').value
      dispatch('addTodo', name)
    })
  }
})
```

### Advanced - Connect

```js
const TodoList = Skuol.connect({
  select: state => ( 
    state.todos.filter(c => c.status === 'TODO')
  ),
  toProps: ({dispatch}) => ({
    moveCard: cardId => dispatch('moveCard', cardId, 'TODO')
  })
})(CardList)
```

### Advanced - Caching a computation result

```js
const activeTodos = Skuol.createFilter((todos, assignee) => {
  const activeNames = assignee
    .filter(a => a.active)
    .map(a => a.name)
  const actives = new Set(activeNames)

  const hasAssignee = (card) => (
    !actives.size ||
    card.assignee.findIndex(n => actives.has(n)) >= 0
  )
  return todos.filter(hasAssignee)
})

const TodoList Skuol.connect({
  select: state => ( 
    activeTodos(state.todos, state.assignee)
        .filter(c => c.status === 'TODO')
  ),
  toProps: ({dispatch}) => ({
    moveCard: cardId => dispatch('moveCard', cardId, 'TODO')
  })
})(CardList)
```

### Advanced - Creating A Plugin

```
const MyStore = function(){
  this.install = (component, props) => {
    component['myStoreKey'] = this
    props['myDispatch'] = function(){}
  }
}
Skuol.install(new MyPlugin())
```

