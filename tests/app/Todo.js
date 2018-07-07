import Skuol from '../../src'

export default Skuol.createComponent({
  tagName: 'li',
  onrender(){
    this.el.innerHTML = `<strong>${this.model.name}</strong>`
  }
})
