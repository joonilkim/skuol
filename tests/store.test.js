import Skuol from '../src'
import { nextTick } from './helpers'


test('should subscribe and unsubscribe', function(){
  const store = new Skuol.Store()

  const unsub = store.subscribe(Function())

  expect(store._subs.length).toBe(1)

  unsub()

  expect(store._subs.length).toBe(0)
})


test('should apply filters in order', function(){

  const store = new Skuol.Store({
    state: {
      res: []
    },
    mutations: {
      test(state){}
    },
    filters: [
      (state) => (
        {...state, res: [...state.res, 'filter1'] }
      ),
      (state) => (
        {...state, res: [...state.res, 'filter2'] }
      )
    ]
  })
  
  store.dispatch('test')

  expect(store.state.res).toEqual(['filter1', 'filter2'])
})

