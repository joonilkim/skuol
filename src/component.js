import { Plugged } from './plugin'

/**
 * @param {String} tagName
 * @param {String} className
 * @param {Function} shouldUpdate (newModel) => boolean, default: !==
 * @param {Function} oncreate
 * @param {Function} onrender
 * This function can be called multiple times. So use this.el.onclick instead of 
 * this.el.addEventListener() or attach those events in oncreate
 */
export default function({
  tagName='div',
  className,
  shouldUpdate,
  oncreate=Function(),
  onrender=Function()
}={}){

  shouldUpdate = shouldUpdate || 
      function(newModel){ return newModel !== this.model }

  /**
   * @param {Object} data a initial data
   * @param {Object} props Properties to pass to onrender
   */
  const Component = function({
    data={},
    props={}
  }={}){

    // merge Plugged.prototype.props
    Object.assign(props, this.props)

    this.el = document.createElement(tagName)
    if(className) this.el.className = className
    this.model = data

    const render = onrender.bind(this)

    // this wouldn't try to render if newModel === oldModel
    this.update = function(data) {
      if(!shouldUpdate.call(this, data)) return
      this.model = data
      render(props)
    }

    // There're 2 ways to destroy component. 
    // component.destroy() or onrender: component.el.removeChild(child.el)
    this.destroy = function() {
      if(this.el.parentNode) 
        this.el.parentNode.removeChild(this.el)
    }

    oncreate.call(this, props)
    render(props)

  }
  Component.prototype = Object.create(Plugged.prototype)
  Component.prototype.constructor = Component

  return Component

}
