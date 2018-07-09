import Skuol from '../src'
import Todos from './app/Todos'
import App from './app'
import { nextTick } from './helpers'


test('should inject $store', async function(){
  const store = new Skuol.Store({})
  const Comp = new Skuol.createComponent({})
  const BoundComp = Skuol.connect()(Comp, store)

  const comp = new BoundComp()
  expect(comp).toHaveProperty('$store')
})


test('should change store\'s subscriptions', async function(){
  const store = new Skuol.Store({
    state: {},
    commits: {
      test(){}
    }
  })
  const Comp = new Skuol.createComponent({})
  const BoundComp = Skuol.connect()(Comp, store)

  const comp = new BoundComp()
  expect(store._subs.length).toBe(1)

  store.dispatch('test')
  await nextTick(100)

  expect(store._subs.length).toBe(0)
})


test('should call lifecycle callbacks', async function(){
  const callbacks = []

  const store = new Skuol.Store({})
  const Comp = new Skuol.createComponent({
    oncreate(){ callbacks.push('created') },
    onrender(){ callbacks.push('rendered') }
  })
  const BoundComp = Skuol.connect()(Comp, store)

  new BoundComp()
  expect(callbacks).toEqual(['created', 'rendered'])
})


test('should apply state changes to component', async function(){
  document.body.innerHTML = '<html><head></head><body></body></html>'
  const body = document.querySelector('body')

  const app = new App()
  body.appendChild(app.el)

  const data = { todo: 'New Todo' }

  app.el.querySelector('input[name=name]').value = data.todo
  // jsdom doesnt have $form.submit()
  app.el.querySelector('button').click()

  await nextTick(100)

  const $newTodo = body.querySelector('li:last-child')
  expect($newTodo.textContent).toEqual(data.todo)
})


