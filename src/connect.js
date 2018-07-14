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

    const BoundComponent = function(){
      const store = this[storeKey]
      assert(store != null, 
          `store[${storeKey}] is not installed. ` +
          `Have you installed store?`)

      const unsub = store.subscribe(state => {
        if(unmounted(this.el)){
          unsub()
        } else {
          const selected = select(state)

          // shallowEqual because select() can return wrapped object.
          // Plus, commits can generate wrapped object which have unchanged values.
          // e.g. (data) => data.map(...)
          if(isEqual(selected, this.model)) return
          this.update(selected)
        }
      })
      
      // build onrender props from toProps
      const params = arguments[0] || {}
      const props  = {
        ...(params.props || {}),
        dispatch: store.dispatch,
        ...toProps(store)
      }

      // set initial this.model from select(state)
      // this lets boundComponent to ignore data property
      const args = {
        ...params, 
        data: select(store.state),
        props
      }
      Component.call(this, args)
    }
    BoundComponent.prototype = Object.create(Component.prototype)
    BoundComponent.prototype.constructor = BoundComponent

    return BoundComponent
  }

}
