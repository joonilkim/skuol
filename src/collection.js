import { isObject, warning, monkeypatch, findIndexFrom } from './utils'
import { assertType, assertArray } from './asserts'
import VNode from './vnode'
import createComponent from './component'


/**
 * @param {String} tagName
 * @param {String} className
 * @param {Function} component A function to return item instance
 * @param {String} id An unique key of item
 * @param {Function} shouldUpdate (data) => boolean, default: this.model === data
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
        const comp = component(data)
        comp.el._id = id
        return comp
      }

      const upsert = (id, data) => {
        let comp = this._components[id]
        if(comp) comp.update(data)
        return comp || createComponent(id, data)
      }

      // remove unnecessary nodes
      const modelIds = new Set(this.model
        .map((d, i) => isObject(d) ? d[id] : i))

      ;[...this.el.children].forEach(child => {
        if(modelIds.has(child._id)) return
        this.el.removeChild(child)
      })

      // insert or update
      const components = {}
      const vnode = new VNode(this.el)

      this.model.forEach((data, i) => {
        const _id = isObject(data) ? data[id] : i

        const comp = upsert(_id, data)
        components[_id] = comp

        let src = vnode.children[i]
        if(src == null) return vnode.appendChild(comp.el)
        if(comp.el === src) return
        
        if(!vnode.hasChild(comp.el)) {
          vnode.insertBefore(comp.el, i)
        } else {
          vnode.swapChild(comp.el, i)
        }
      })

      // remove redundants
      //while(vnode.children.length > this.model.length) {
      //  vnode.removeLast()
      //}

      this._components = components
      onrender.call(this, props)
    }
  })

}
