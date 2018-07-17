import Skuol from '../src'


test('should have installed properties', function(){
  const pluginKey = '$myPlugin'
  const plugin = { [pluginKey]: {} }

  Skuol.install({
    install(Component){
      Object.assign(Component.prototype, plugin)
    }
  })

  const Comp = new Skuol.createComponent({})
  const comp = new Comp()
  expect(comp[pluginKey]).toBe(plugin[pluginKey])
})


test('should have injected properties', function(){
  const expectedProps = {a: 1}

  Skuol.install({
    install(Component){
      Object.assign(Component.prototype.props, expectedProps)
    }
  })

  let onrenderProps = {}
  const Comp = new Skuol.createComponent({
    onrender(props){
      onrenderProps = props
    }
  })
  const comp = new Comp()
  expect(onrenderProps).toEqual(expectedProps)
})

