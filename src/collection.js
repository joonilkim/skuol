import { isObject, warning, monkeypatch, findIndexFrom } from './utils'
import { assertType, assertArray } from './asserts'
import VNode from './vnode'
import createComponent from './component'


/**
 * @param {String} tagName
 * @param {String} className
 * @param {Component} component A class which can be a collection's item
 * @param {String} id An unique key of item
 * @param {Function} shouldUpdate (newModel) => boolean, default: !==
 * @param {Function} oncreate
 * @param {Function} onrender
 */
export default function({
  tagName,
  className,
  component,
  id='id',
  shouldUpdate,
  oncreate=Function(),
  onrender=Function()
}={}){

  assertType(component, 'function')
  assertType(onrender, 'function')

  oncreate = monkeypatch(function(){
    // init this.model if no data is provided
    this.model = Array.isArray(this.model) ? this.model : []
    this._components = {}
  }, oncreate)

  return createComponent({
    tagName,
    className,
    shouldUpdate,
    oncreate,
    onrender(props){

      assertArray(this.model)

      const createComponent = (id, data) => {
        const comp = new component({data, props})
        comp.el._id = id
        return comp
      }

      const upsert = (id, data) => {
        let comp = this._components[id]
        if(comp) comp.update(data)
        return comp || createComponent(id, data)
      }

      const getId = (o, orValue) => (
        o.hasOwnProperty(id) ? o[id] : orValue
      )

      // quick clear
      if(!this.model.length)
        this.el.textContent = ''

      const components = {}
      const vnode = new VNode(this.el)

      // remove unnecessary nodes
      const modelIds = new Set(this.model.map(getId))
      ;[...vnode.children].forEach(child => {
        if(modelIds.has(child._id)) return
        vnode.removeChild(child)
      })

      // insert or update
      this.model.forEach((data, i) => {
        const _id = getId(data, i)

        const comp = upsert(_id, data)
        components[_id] = comp

        let src = vnode.children[i]
        if(src == null) 
          return vnode.appendChild(comp.el)
        if(comp.el._id === src._id) return
        
        if(!vnode.hasChild(comp.el)) {
          vnode.insertBefore(comp.el, i)
        } else {
          vnode.swapChild(comp.el, i)
        }
      })

      this._components = components
      onrender.call(this, props)
    }
  })

}
