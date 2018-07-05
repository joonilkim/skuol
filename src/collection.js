import { assert, empty, shallowEqual, merge } from './utils'
import createComponent from './component'

function defaultComparator(a, b){
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
 * @param {Function} ondestroy
 */
export default function({
  tagName,
  className,
  is,
  component,
  id='id',
  comparator=defaultComparator,
  oncreate=Function(),
  ondestroy=Function()
}={}){

  assert(process.env.NODE_ENV !== 'production' &&
      typeof component === 'function', 
      `required argument: ${component}`)

  is = is || function(model){
    this.model.length === model.length &&
    this.model.forEach(
      (m, i) => shallowEqual(m, model[i]))
  }

  oncreate = merge(function(){
    // init this.model if no data is provided
    this.model = Array.isArray(this.model) ? this.model : []
    this._components = []
  }, oncreate)

  return createComponent({
    tagName,
    className,
    is,
    oncreate,
    ondestroy,
    onrender(components){

      if(!Array.isArray(this.model)) {
        console.error(`expected array, but ${typeof this.model}`)
        return
      }
      this.model.sort(comparator)

      const createComponent = (data) => {
        const comp = component(data)
        comp.el.dataset.id = data[id]
        return comp
      }

      const upsert = (data) => {
        // data sync안된경우 id 없을 수 있음
        // update안됐을 수 있기 때문에 component.is(data)로 찾으면 안됨
        const c = components.find(c => c.model[id] === data[id])
        if(!c) return createComponent(data)  // inserted
        if(!c.is(data)) c.update(data)     // updated
        return c
      }
      components = this.model.map(upsert)

      components.forEach((c,i) => {
        const child = this.el.children[i]
        if(!child) {
          this.el.appendChild(c.el)
        } else if(child.dataset.id != c.model[id]) {
          this.el.insertBefore(c.el, child)
        }
      })

      while(this.el.children.length > components.length) {
        this.el.removeChild(this.el.lastChild)
      }

      //const df = document.createDocumentFragment()
      //components.forEach(c => df.appendChild(c.el))

      //empty(this.el)
      //this.el.appendChild(df)

      return components
    }
  })

}
