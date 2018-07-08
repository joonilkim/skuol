import Skuol from '../src'


test('should reuse cached one', function(){
  let counter = 0

  const filter = new Skuol.createFilter((state) => {
    counter++
    return state
  })

  const state = {a:[]}

  filter(state)
  expect(counter).toBe(1)

  const state2 = {...state}
  filter(state2)
  expect(counter).toBe(2)

  filter(state2)
  expect(counter).toBe(2)
})

