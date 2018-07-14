import Skuol from 'skuol'
import Cards from './Cards'
import { activeCards } from '../filters'
import { TODO, INPROGRESS, DONE } from '../constants'

export default Skuol.connect({
  select: state => ( 
    activeCards(state.cards, state.assignee)
        .filter(c => c.status === TODO)
  ),
  toProps: ({dispatch}) => ({
    moveCard: cardId => dispatch('moveCard', cardId, TODO)
  })
})(Cards)
