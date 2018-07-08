import { assert, empty, shallowEqual, monkeypatch } from './utils'
import createComponent from './component'

function cmp(a, b){
  return a === b ? 0 : (a > b ? 1 : -1)
}

/**
 * @param {String} tagName
 * @param {String} className
 * @param {Function} is
 * @param {Function} component A function to return item instance
 * @param {String} id An unique key of item
 * @param {Function} comparator A comparator for sorting
 * @param {Function} oncreate
 * @param {Function} onrender
 */
export default function({
  tagName,
  className,
  is,
  component,
  id='id',
  comparator=cmp,
  oncreate=Function(),
  onrender=Function()
}={}){

  if(process.env.NODE_ENV !== 'production'){
    assert(typeof component === 'function',
        `required argument: ${component}`)

    assert(typeof onrender === 'function',
        `expected function, but got ${typeof onrender}`)
  }

  is = is || function(model){
    this.model.length === model.length &&
    this.model.findIndex(
      (m, i) => !shallowEqual(m, model[i])) < 0
  }

  oncreate = monkeypatch(function(){
    // init this.model if no data is provided
    this.model = Array.isArray(this.model) ? this.model : []
    this._components = []
  }, oncreate)

  return createComponent({
    tagName,
    className,
    is,
    oncreate,
    onrender(props){

      if(!Array.isArray(this.model)) {
        console.error(`expected array, but ${typeof this.model}`)
        return
      }
      this.model.sort(comparator)

      const createComponent = (data) => {
        const comp = component(data)
        if(typeof data === 'object' && id in data) 
          comp.el.dataset.id = data[id]
        else
          console.warn(`required ${id} property`)
        return comp
      }

      const upsert = (data) => {
        // data sync안된경우 id 없을 수 있음
        // update안됐을 수 있기 때문에 component.is(data)로 찾으면 안됨
        const c = this._components.find(c => c.model[id] === data[id])
        if(!c) return createComponent(data)  // inserted
        if(!c.is(data)) c.update(data)     // updated
        return c
      }
      const components = this.model.map(upsert)

      components.forEach((c,i) => {
        const child = this.el.children[i]
        if(!child) {
          this.el.appendChild(c.el)
        } else if(child.dataset.id != c.model[id]) {
          this.el.insertBefore(c.el, child)
        }
      })

      // remove redundants
      while(this.el.children.length > components.length) {
        this.el.removeChild(this.el.lastChild)
      }
      this._components
        .filter(c => !c.el.parentNode)
        .forEach(c => c.destroy)

      this._components = components

      onrender(props)
    }
  })

}
