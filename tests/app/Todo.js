import Skuol from '../../src'

export default Skuol.createComponent({
  tagName: 'li',
  onrender(components){
    this.el.innerHTML = `<strong>${this.model.name}</strong>`
    return components
  }
})
