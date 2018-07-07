import Skuol from 'skuol'
import Card from './Card'

export default Skuol.createCollection({
  tagName: 'ul',
  component(data){
    return new Card({data})
  },
  comparator(a, b){
    return a.sortKey - b.sortKey
  }
})

