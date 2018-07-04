import Skuol from '../../src'

export default Skuol.createComponent({
  tag: 'li',
  onrender(components){
    this.el.innerHTML = `<strong>${this.model.name}</strong>`
    return components
  }
})
