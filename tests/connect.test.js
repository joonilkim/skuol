import Todos from './app/Todos'
import App from './app'
import { nextTick } from './helpers'


beforeEach(() => {
  document.body.innerHTML = '<html><head></head><body></body></html>'
})

afterEach(() => {
})


test('should connect store and component', async function(){
  const body = document.querySelector('body')

  const app = new App()
  body.appendChild(app.el)

  const data = { todo: 'New Todo' }

  app.el.querySelector('input[name=name]').value = data.todo
  // jsdom doesnt have $form.submit()
  app.el.querySelector('button').click()

  await nextTick(100)

  const $newTodo = body.querySelector('li:last-child')
  expect($newTodo.textContent).toEqual(data.todo)

})

