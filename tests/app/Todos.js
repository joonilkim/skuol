import Skuol from '../../src'
import Todo from './Todo'

export default Skuol.createCollection({
  tagName: 'ul',
  component(data){
    return new Todo({data})
  },
  comparator(a, b){
    return a.name === b.name ? 0 : (a.name > b.name ? 1 : -1)
  }
})
