import Skuol from 'skuol'
import store from '../store'
import Cards from './Cards'
import { activeCards } from '../filters'
import { TODO, INPROGRESS, DONE } from '../store'

export default Skuol.connect({
  select: state => ( 
    activeCards(state.cards, state.assignee)
        .filter(c => c.status === DONE)
  ),
  storeToProps: ({dispatch}) => ({
    moveCard: cardId => dispatch('moveCard', cardId, DONE)
  })
})(Cards, store)
