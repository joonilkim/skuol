import Skuol from '../src'
import App, { store as appStore } from './app'
import { nextTick } from './helpers'


test('should change store\'s subscriptions', function(){
  const store = new Skuol.Store({
    state: {},
    commits: {
      test(){}
    }
  })

  Skuol.install(store)

  const Comp = new Skuol.createComponent({})
  const BoundComp = Skuol.connect()(Comp)

  const comp = new BoundComp()
  expect(store._subs.length).toBe(1)

  store.dispatch('test')

  expect(store._subs.length).toBe(0)
})


test('should call lifecycle callbacks', function(){
  const callbacks = []

  const store = new Skuol.Store({})
  Skuol.install(store)

  const Comp = new Skuol.createComponent({
    oncreate(){ callbacks.push('created') },
    onrender(){ callbacks.push('rendered') }
  })
  const BoundComp = Skuol.connect()(Comp)

  new BoundComp()
  expect(callbacks).toEqual(['created', 'rendered'])
})


test('should pass toProps to onrender', function(){
  let onrenderProps = null

  const store = new Skuol.Store({})
  Skuol.install(store)

  const Comp = new Skuol.createComponent({
    onrender(props){ onrenderProps = props }
  })
  const BoundComp = Skuol.connect({
    toProps({dispatch}){
      return { myDispatch(){} }
    }
  })(Comp)

  new BoundComp()
  expect(onrenderProps).toHaveProperty('myDispatch')
  expect(typeof onrenderProps.myDispatch).toBe('function')
})


test('should apply state changes to component', async function(){
  
  Skuol.install(appStore)
  const app = new App()

  document.body.innerHTML = '<html><head></head><body></body></html>'
  const body = document.querySelector('body')
  body.appendChild(app.el)

  const data = { todo: 'New Todo' }

  app.el.querySelector('input[name=name]').value = data.todo
  // jsdom doesnt have $form.submit()
  app.el.querySelector('button').click()

  await nextTick(100)

  const $newTodo = body.querySelector('li:last-child')
  expect($newTodo.textContent).toEqual(data.todo)
})

