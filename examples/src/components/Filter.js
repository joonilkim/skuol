import Skuol from 'skuol'
import { escape } from '../utils'

const FilterItem = Skuol.createComponent({
  className: 'filter-item',
  onrender({ setActiveAssignee }){
    this.el.innerHTML = `
      <label>
        <input type='checkbox' 
          name='assignee[]'
          value='${this.model.name}'
          ${this.model.active ? 'checked' : ''}>
        ${escape(this.model.name)}
      </label>
    `

    this.el.querySelector('[type=checkbox]').onclick = (e) => {
      e.preventDefault()
      e.stopPropagation()
      const names = [...this.el.querySelectorAll(
          '[name="assignee[]"]:checked')]
          .map(el => el.value)
      setActiveAssignee(names)
    }
  }
})

const Filter = Skuol.createCollection({
  className: 'filter',
  component: FilterItem
})

export default Skuol.connect({
  select: (state) => state.assignee,
  toProps: ({dispatch}) => ({
    setActiveAssignee(names){ 
      dispatch('setActiveAssignee', names) 
    }
  })
})(Filter)
