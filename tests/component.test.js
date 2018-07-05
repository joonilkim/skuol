import Skuol from '../src'
import Todos from './app/Todos'
import App from './app'
import { nextTick } from './helpers'


test('should support className', function(){
  const className = 'test'

  const Comp = Skuol.createComponent({ className })

  const comp = new Comp()
  expect(comp.el.className).toEqual(className)
})


test('should render', function(){
  const data = [
    {id: 0, name: 'Walking'},
    {id: 1, name: 'Listening Music'}
  ]

  document.body.innerHTML = '<html><head></head><body></body></html>'
  const body = document.querySelector('body')
  body.appendChild(new Todos({data}).el)

  const texts = [...body.querySelectorAll('li')].map(el => el.textContent)
  expect(texts).toEqual(data.map(t => t.name))
})

