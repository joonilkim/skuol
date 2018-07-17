import { monkeypatch, shallowEqual } from './utils'
import { assert } from './asserts'

const unmounted = function(el){
  while(el.parentNode)
    el = el.parentNode
  return el !== document
}

/**
 * Connects Component and Store. Every state changes propagate to 
 * component instances. Ignores component's data property. Initial 
 * component.model is select(store.state)
 * @param {Function} select A function which transform state to this.model
 * @param {Function} isEqual default is shallowEqual
 * @param {Function} toProps A function which transform Store to props
 * ({state, dispatch}) => {}
 */
export default function({
  select=(_=>_),
  isEqual,
  toProps=(_=>{})
}={}){

  isEqual = isEqual || shallowEqual

  return function(Component, storeKey='$store'){

    const onconnect = function(component, props){
      const store = component[storeKey]
      assert(store != null, 
          `component[${storeKey}] is not installed.`)

      const unsub = store.subscribe(state => {
        if(unmounted(component.el)){
          unsub()
        } else {
          const selected = select(state)

          // shallowEqual because select() can return wrapped object.
          // Plus, commits can generate wrapped object which have unchanged values.
          // e.g. (data) => data.map(...)
          if(isEqual(selected, component.model)) return
          component.update(selected)
        }
      })
      
      // convert toProps to component's props
      Object.assign(props, toProps(store))

      // set initial this.model from select(state)
      // this lets boundComponent to ignore data property
      component.model = select(store.state)
    }

    const BoundComponent = function(){
      this._plugins = [...this._plugins, onconnect]
      Component.apply(this, arguments)
    }
    BoundComponent.prototype = Object.create(Component.prototype)
    BoundComponent.prototype.constructor = BoundComponent

    return BoundComponent
  }

}
