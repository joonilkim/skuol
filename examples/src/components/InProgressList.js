import Skuol from 'skuol'
import store from '../store'
import Cards from './Cards'
import { TODO, INPROGRESS, DONE } from '../store'

export default Skuol.connect({
  select: state => ( 
    state.activeCards.filter(c => c.status === INPROGRESS)
  ),
  storeToProps: ({dispatch}) => ({
    moveCard: cardId => dispatch('moveCard', cardId, INPROGRESS)
  })
})(Cards, store)
