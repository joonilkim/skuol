import Skuol from 'skuol'
import Card from './Card'

export default Skuol.createCollection({
  tagName: 'ul',
  className: 'cards',
  component(data){
    return new Card({data})
  },
  comparator(a, b){
    return a.sortKey - b.sortKey
  },
  oncreate({moveCard}){
    if(!moveCard) return

    this.el.ondrop = (e) => {
      e.preventDefault()
      const cardId = e.dataTransfer.getData('text')
      moveCard(cardId)
    }

    this.el.ondragover = (e) => {
      e.preventDefault()
    }

    this.el.ondragenter = (e) => {
      this.el.classList.add('active')
    }

    this.el.ondragleave = (e) => {
      this.el.classList.remove('active')
    }

  }
})

