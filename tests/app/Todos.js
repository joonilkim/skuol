import Skuol from '../../src'
import Todo from './Todo'

export default Skuol.createCollection({
  tagName: 'ul',
  component(data){
    return new Todo({data})
  }
})
