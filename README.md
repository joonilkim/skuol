# Skuol

A lightweight state management library for native DOM

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
  oncreate({ dispatch }){
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

## Component

### createComponent({ tagName='div', className, shouldUpdate, oncreate, onrender })

Creates a `Component` class

1. `shouldUpdate` *(function(model: Object): boolean)*: Called whenever `component.update` is called. Decides whether to call `component.onrender`. The default comparator is !==.
1. `oncreate` *(function(props: Object))*: A lifecycle callback. Called when `Component` instance is created.
1. `onrender` *(function(props: Object))*: A lifecycle callback. Called when `Component` instance is created or updated.

### createCollection({ tagName='div', className, id='id', component, shouldUpdate, oncreate, onrender})

Creates a `Component` class which has a default `onrender` implementation for an array of data. Array type is only allowed for the parameter of `component.constructor` and `component.update`

1. `id` *(String)*: An unique key which represents each element of data.
1. `component` *(Component)*: A child `Component` class which will receive an element of data.
1. `onrender` *(Function)*: Called after the default `onrender` is executed.

### new Component({ data, props })

1. `data` *(Object)*: An initial data. When `Store` is connected, this is ignored.
1. `props` *(Object)*: Parameters which is passed to the lifecycle callbacks.

### component.el

Represents this component's top level Element Node.

### component.model

Represents this component's model. A `constructor` or `update`'s argument is converted to this.

### component.update(model)

Calls `onrender`. The call is determined by the result of `shouldUpdate`

### component.destroy()

Unmounts `component.el` from its parent Node.

## Store

### new Store({ state, [actions], commits, [storeKey='$store'] })

1. `state` *(Object)*: An initial immutable state
1. `actions` *({ [name: string]: Function })*: A action handler receives an context object which represents `state`, `dispatch` and `commit`. You should change `state` in commit handlers only.
1. `commits` *({ [name: string]: Function })*: A commit handler receives a shallow copy of `state` object that will be an next state. Because `state` should not be mutated, to change its properties, you should use [Immutable update patterns](https://redux.js.org/recipes/structuring-reducers/immutable-update-patterns)

```js
new Skuol.Store({
  state: {
    todos: []
  },
  actions: {
    async addTodo({commit}, name){
      const todo = await post('/todos')
      commit('addTodo', todo)
    }
  },
  commits: {
    addTodo(state, todo){
      state.todos = [ ...state.todos, todo ]
    }
  }
})
```

### store.state

Returns a `state`. You should change `state` in commit handlers only.

### store.dispatch(actionName: String, ...args)

Calls a actions[actionName] handler. If it's not exists, calls a commits[actionName] handler.

## Other API

### connect({ [select: Function], [toProps: Function] })(Component, [storeKey='$store'])

Creates a connector which connects `Component` instances and a `Store` instance. The store should be installed before creating a `Component` instance.

1. `select` *(function(state): Object)*: A function which selects a subset of `Store`.state. Whenever the state is changed, the selected data is passed to the `component.update`
1. `toProps` *(function(props: Object): Object)*: A function which returns lifecycle callback parameters.

```js
Skuol.install(store)

const TodoList = Skuol.connect({
  select: state => ( 
    state.todos.filter(c => c.status === 'TODO')
  ),
  toProps: ({dispatch}) => ({
    moveCard: cardId => dispatch('moveCard', cardId, 'TODO')
  })
})(CardList)
```

### createFilter(Function): Function

A function which creates a filter function. The function returns a cached result for the same arguments.

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
})(CardList)
```

### install(Plugin)

Installs a `Plugin`.

1. `Plugin` *({install: Function})*: An install handler receives a `Component`. You can use a `Component.prototype` to inject component-wide properties or `Component.prototype.props` to add lifecycle callback parameters.

```js
const MyStore = function(){
  this.install = (Component) => {
    // set instance properties
    Component.prototype.$myStoreKey = this

    // add lifecycle properties
    Component.prototype.props.myDispatch = function(){}
  }
}
Skuol.install(new MyPlugin())
```

