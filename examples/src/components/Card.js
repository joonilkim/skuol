import Skuol from 'skuol'
import store from '../store'

export default Skuol.createComponent({
  tagName: 'li',
  className: 'card',
  onrender(){
    this.el.innerHTML = `
      <button class='card-del'>X</button>
      <dl class='card-item'>
        <dt>Title</dt>
        <dd>${this.model.title}</dd>
        <dt>Description</dt>
        <dd>${this.model.description}</dd>
        <dt>Assignee</dt>
        <dd>${this.model.assignee}</dd>
      </dl>
    `

    this.el.querySelector('.card-del').addEventListener('click', () => {
      store.dispatch('removeCard', this.model)
    })
  }
})
