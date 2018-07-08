import Skuol from 'skuol'
import store from '../store'
import { escape } from '../utils'

export default Skuol.createComponent({
  tagName: 'li',
  className: 'card',
  oncreate(){
    this.el.setAttribute('draggable', true)
  },
  onrender(){
    this.el.innerHTML = `
      <button class='card-del'>X</button>
      <dl class='card-item'>
        <dt>Title</dt>
        <dd>${escape(this.model.title)}</dd>
        <dt>Description</dt>
        <dd>${escape(this.model.description)}</dd>
        <dt>Assignee</dt>
        <dd>${this.model.assignee.map(escape).join(', ')}</dd>
      </dl>
    `

    this.el.querySelector('.card-del').onclick = () => {
      store.dispatch('removeCard', this.model)
    }

    this.el.ondragstart = (e) => {
      e.dataTransfer.setData('text/plain', this.model.id)
      e.dataTransfer.dropEffect = 'move'
      this.el.classList.add('dragging')
    }

    this.el.ondragend = (e) => {
      e.currentTarget.classList.remove('dragging')
      ;[...document.querySelectorAll('.cards.droppable')].forEach(el =>
        el.classList.remove('droppable')
      )
    }

  }
})
