import Skuol from 'skuol'
import store from '../store'
import Todo from './Todo'

const Todos = Skuol.createCollection({
  tagName: 'ul',
  component(data){
    return new Todo({data})
  },
  comparator(a, b){
    return a.name === b.name ? 0 : (a.name > b.name ? 1 : -1)
  }
})

export default Skuol.connect({
  select(state){ return state.todos }
})(Todos, store)
