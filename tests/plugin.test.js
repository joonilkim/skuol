import Skuol from '../src'


test('should have installed properties', function(){
  const pluginKey = '$myPlugin'
  const plugin = { [pluginKey]: {} }

  const uninstall = Skuol.install({
    install(component){
      Object.assign(component, plugin)
    }
  })

  const Comp = new Skuol.createComponent({})
  const comp = new Comp()
  expect(comp[pluginKey]).toBe(plugin[pluginKey])

  uninstall()
})


test('should have injected properties', function(){
  const expectedProps = {a: 1}

  const uninstall = Skuol.install({
    install(_, props){
      Object.assign(props, expectedProps)
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

  uninstall()
})

