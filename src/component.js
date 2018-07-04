import { shallowEqual } from './utils'

/**
 * @param {Object|Array} components
 */
function sweepGarbages(components){
  Object.keys(components).forEach(k => {
    const c = components[k]
    if(c.el.parentNode) return
    c.destroy()
  })
}

/**
 * @param {String} tag
 * @param {Function} is
 * @param {Function} onrender
 * @param {Function} onstate
 * @param {Function} ondestroy
 */
export default function({
  tag='div',
  is,
  options={},
  onrender,
  oncreate=Function(),
  ondestroy=Function()
}={}){

  onrender = onrender || function(comps){ return comps }

  /**
   * @param {Object} data a initial data
   */
  return function({
    data={},
    $props
  }={}){

    if($props) {
      Object.keys($props).forEach(k => {
        Object.defineProperty(this, '$'+k, {value: $props[k]})
      })
    }

    this.el = document.createElement(tag)
    this.model = data
    this._components = {}
    this.is = is || function(model){ return shallowEqual(this.model, model) }

    this.update = (newModel) => {
      const old = this.model
      this.model = newModel
      if(this.is(old)) return  // no change

      const exists = this._components
      this._components = onrender.call(this, exists)
      sweepGarbages(exists)
    }

    this.destroy = () => {
      if(this.el.parentNode) 
        this.el.parentNode.removeChild(this.el)
      ondestroy.call(this)
    }

    oncreate.call(this)
    this._components = onrender.call(this, this._components)

  }

}
