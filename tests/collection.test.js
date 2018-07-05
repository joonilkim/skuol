import Skuol from '../src'


test('should call lifecycle callbacks', function(){
  const callbacks = []

  const Comp = new Skuol.createCollection({
    component(){ return null },
    oncreate(){ callbacks.push('created') },
    ondestroy(){ callbacks.push('destroyed') },
    onrender(_){ callbacks.push('rendered'); return _ }
  })

  new Comp().destroy()
  expect(callbacks).toEqual(['created', 'rendered', 'destroyed'])
})

