import Skuol from 'skuol'
import store from '../store'
import Cards from './Cards'
import { TODO, INPROGRESS, DONE } from '../store'

export default Skuol.connect({
  select(state){ 
    return state.activeCards.filter(c => 
      c.status === INPROGRESS
    )
  }
})(Cards, store)
