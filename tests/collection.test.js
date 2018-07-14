import Skuol from '../src'


test('should call lifecycle callbacks', function(){
  const callbacks = []

  const Comp = new Skuol.createCollection({
    component: Function(),
    oncreate(){ callbacks.push('created') },
    onrender(){ callbacks.push('rendered') }
  })

  new Comp()
  expect(callbacks).toEqual(['created', 'rendered'])
})


test('should release its children', function(){
  const Child = Skuol.createComponent()
  const Comp = Skuol.createCollection({
    component: Child
  })

  const comp = new Comp({data: [1, 2]})
  expect(Object.keys(comp._components).length).toBe(2)

  comp.update([])
  expect(comp.el.children.length).toBe(0)
  expect(Object.keys(comp._components).length).toBe(0)
})



