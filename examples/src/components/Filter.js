import Skuol from 'skuol'
import store from '../store'
import { deepEqual, escape } from '../utils'

const Filter = Skuol.createComponent({
  onrender({ setActiveAssignee }){
    const createChild = function(data){
      const el = document.createElement('li')
      el.className = 'filter-item'
      el.innerHTML = `
        <label>
          <input type='checkbox' 
            name='assignee[]'
            value='${data.name}'
            ${data.active ? 'checked' : ''}>
          ${escape(data.name)}
        </label>
      `
      el.querySelector('[type=checkbox]').onclick = onclick
      return el
    }

    const onclick = (e) => {
      e.preventDefault()
      e.stopPropagation()
      const names = [...this.el.querySelectorAll('[name="assignee[]"]:checked')]
          .map(el => el.value)
      setActiveAssignee(names)
    }

    const ul = document.createElement('ul')
    ul.className = 'filter'

    this.model.forEach(assignee =>
      ul.appendChild(createChild(assignee))
    )

    if(this.el.firstChild)
      this.el.replaceChild(ul, this.el.firstChild)
    else
      this.el.appendChild(ul)

  }
})

export default Skuol.connect({
  select(state){ return state.assignee },
  storeToProps({dispatch}){
    return { setActiveAssignee: names => dispatch('setActiveAssignee', names) }
  }
})(Filter, store)
