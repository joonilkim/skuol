import Skuol from 'skuol'
import store from '../store'
import { shallowArrayEqual } from '../utils'

const Filter = Skuol.createComponent({
  tagName: 'ul',
  className: 'filter',
  is(model){
    return shallowArrayEqual(this.model, model)
  },
  onrender(){
    const createChild = function(data){
      const el = document.createElement('li')
      el.className = 'filter-item'
      el.innerHTML = `
        <label>
          <input type='checkbox' 
            name='assignee[]'
            value='${data.name}'
            ${data.active ? 'checked' : ''}>
          ${data.name}
        </label>
      `
      el.querySelector('[type=checkbox]').addEventListener('click', onclick)
      return el
    }

    const onclick = (e) => {
      e.preventDefault()
      const names = [...this.el.querySelectorAll('[name="assignee[]"]:checked')]
          .map(el => el.value)
      store.dispatch('setActiveAssignee', names)
    }

    while(this.el.firstChild) 
      this.el.removeChild(this.el.firstChild)

    this.model.forEach(assignee =>
      this.el.appendChild(createChild(assignee))
    )
  }
})

export default Skuol.connect({
  select(state){
    return state.assignee
  }
})(Filter, store)
