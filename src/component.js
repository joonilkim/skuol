import { shallowEqual, filterObject } from './utils'


/**
 * @param {Object|Array} components
 */
function handleOrphans(components){
  Object.values(components)
    .filter(c => !c.el.parentNode)
    .forEach(c => c.destroy())
}

/**
 * @param {Object|Array} components
 */
function destroyChildren(){
  const list = this._components
  Object.values(list)
    .filter(c => !!c)
    .forEach(c => c.destroy())
}


function unlinkParent(parentComponent){
  const list = parentComponent._components
  if(Array.isArray(list)){
    const i = list.indexOf(this)
    if(i >= 0) list.splice(i, 1)
  } else if(typeof list === 'object') {
    const key = Object.keys(list).find(k => list[k] === this)
    if(key) delete list[key]
  }
}

/**
 * @param {String} tagName
 * @param {String} className
 * @param {Function} is
 * @param {Function} oncreate
 * @param {Function} onrender
 * This function can be called multiple times. So use this.el.onclick() instead of 
 * this.el.addEventListener() in onrender or attach those events in oncreate
 */
export default function({
  tagName='div',
  className,
  is,
  oncreate=Function(),
  onrender=Function()
}={}){

  /**
   * @param {Object} data a initial data
   * @param {Object} props Properties to pass to onrender
   */
  return function({
    data={},
    props={}
  }={}){

    //if($props) {
    //  Object.keys($props).forEach(k => {
    //    Object.defineProperty(this, '$'+k, {value: $props[k]})
    //  })
    //}

    this.el = document.createElement(tagName)
    if(className) this.el.className = className
    this.model = data
    this.is = is || function(model){ return shallowEqual(this.model, model) }

    const render = onrender.bind(this)

    this.update = (newModel) => {
      const old = this.model
      this.model = newModel
      if(this.is(old)) return  // no change
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
