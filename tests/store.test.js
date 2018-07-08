import Skuol from '../src'
import { nextTick } from './helpers'


test('should subscribe and unsubscribe', function(){
  const store = new Skuol.Store()

  const unsub = store.subscribe(Function())

  expect(store._subs.length).toBe(1)

  unsub()

  expect(store._subs.length).toBe(0)
})


