import Todos from './app/Todos'
import App from './app'
import { nextTick } from './helpers'


beforeEach(() => {
  document.body.innerHTML = '<html><head></head><body></body></html>'
})

afterEach(() => {
})


test('should render', function(){
  const data = [
    {id: 0, name: 'Walking'},
    {id: 1, name: 'Listening Music'}
  ]

  const body = document.querySelector('body')
  body.appendChild(new Todos({data}).el)

  const texts = [...body.querySelectorAll('li')].map(el => el.textContent)
  expect(texts).toEqual(data.map(t => t.name))
})

