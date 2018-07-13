import Skuol from '../src'


test('should have installed properties', function(){
  const pluginKey = '$myPlugin'
  const plugin = { [pluginKey]: {} }

  const uninstall = Skuol.install({
    install: () => plugin
  })

  const Comp = new Skuol.createComponent({})
  const comp = new Comp()
  expect(comp[pluginKey]).toBe(plugin[pluginKey])

  uninstall()
})

