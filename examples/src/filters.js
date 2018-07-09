import Skuol from 'skuol'

const activeCards = Skuol.createFilter((cards, assignee) => {
  const activeNames = assignee
    .filter(a => a.active)
    .map(a => a.name)
  const actives = new Set(activeNames)

  const hasAssignee = (card) => (
    !actives.size ||
    card.assignee.findIndex(n => actives.has(n)) >= 0
  )
  return cards.filter(hasAssignee)
})

export {
  activeCards
}
