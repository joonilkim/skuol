import Skuol from 'skuol'
import store from '../store'
import { shallowArrayEqual, escape } from '../utils'

const Filter = Skuol.createComponent({
  tagName: 'ul',
  className: 'filter',
  is(model){
    return shallowArrayEqual(this.model, model)
  },
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

    while(this.el.firstChild) 
      this.el.removeChild(this.el.firstChild)

    this.model.forEach(assignee =>
      this.el.appendChild(createChild(assignee))
    )
  }
})

export default Skuol.connect({
  select: state => ( state.assignee ),
  storeToProps: ({dispatch}) => ({
    setActiveAssignee: names => dispatch('setActiveAssignee', names)
  })
})(Filter, store)
