import Skuol from '../src'
import { nextTick } from './helpers'


test('should subscribe and unsubscribe', function(){
  const store = new Skuol.Store()

  const unsub = store.subscribe(Function())

  expect(store._subs.length).toBe(1)

  unsub()

  expect(store._subs.length).toBe(0)
})


test('should have mutate\'s copy', function(){
  const store = new Skuol.Store({
    state: {
      obj: {}
    },
    commits: {
      test(state, val){
        state.obj = {val: val}
      }
    }
  })

  const oldObj = store.state.obj

  const newVal = 1
  store.dispatch('test', newVal)

  expect(store.state.obj.val).toBe(newVal)

  expect(store.state.obj).not.toBe(oldObj)
})


test('should not allow to mutate state', function(){
  const store = new Skuol.Store({
    state: {
      obj: {a: 1}
    },
    mutations: {
      mutating(state, val){
        state.obj.a += val
      }
    }
  })

  expect(() => {
    store.dispatch('mutating', 1)
  }).toThrow()

})


