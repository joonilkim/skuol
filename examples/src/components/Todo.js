import Skuol from 'skuol'
import store from '../store'

export default Skuol.createComponent({
  tagName: 'li',
  onrender(components){
    this.el.innerHTML = `
      <strong>${this.model.name}</strong>
      <button>Delete</button>
    `

    this.el.querySelector('button').addEventListener('click', () => {
      store.dispatch('removeTodo', this.model)
    })

    return components
  }
})
