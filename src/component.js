/**
 * @param {String} tagName
 * @param {String} className
 * @param {Function} shouldUpdate (data) => boolean, default: this.model === data
 * @param {Function} oncreate
 * @param {Function} onrender
 * This function can be called multiple times. So use this.el.onclick() instead of 
 * this.el.addEventListener() in onrender or attach those events in oncreate
 */
export default function({
  tagName='div',
  className,
  shouldUpdate,
  oncreate=Function(),
  onrender=Function()
}={}){

  shouldUpdate = shouldUpdate || function(data){ return data === this.model }

  /**
   * @param {Object} data a initial data
   * @param {Object} props Properties to pass to onrender
   */
  return function({
    data={},
    props={}
  }={}){

    this.el = document.createElement(tagName)
    if(className) this.el.className = className
    this.model = data

    const render = onrender.bind(this)

    // this wouldn't try to render if newModel === oldModel
    this.update = (newModel) => {
      const old = this.model
      this.model = newModel
      if(shouldUpdate.call(this, old)) return
      render(props)
    }

    // There're 2 ways to destroy component. 
    // component.destroy() or onrender: component.el.removeChild(child.el)
    this.destroy = () => {
      if(this.el.parentNode) 
        this.el.parentNode.removeChild(this.el)
    }

    oncreate.call(this, props)
    render(props)

  }

}
