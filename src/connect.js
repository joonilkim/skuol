import { monkeypatch, shallowEqual } from './utils'

const unmounted = function(el){
  while(el.parentNode)
    el = el.parentNode
  return el !== document
}

/**
 * Connects Component and store. Every state changes propagate to component instances.
 * Ignores component's data property. Initial component.model is select(store.state)
 *
 * @param {Function} select A function which transform state to this.model
 * @param {Function} isEqual default is shallowEqual
 * @param {Function} storeToProps A function which returns props of onrender
 * ({state, dispatch}) => {}
 */
export default function({
  select,
  isEqual,
  storeToProps=(_=>{})
}={}){

  select = select || function(){ return this.model }
  isEqual = isEqual || function(data){ return shallowEqual(this.model, data) }

  return function(Component, store){

    const BoundComponent = function(){

      const unsub = store.subscribe((state) => {
        if(unmounted(this.el)){
          unsub()
        } else {
          const selected = select.call(this, state)

          // shallowEqual because select() can return wrapped object.
          // Plus, commits can generate wrapped object which have unchanged values.
          // e.g. state.x = state.x.filter(...)
          if(isEqual.call(this, selected)) return
          this.update(selected)
        }
      })
      // this should be created before onrender is called
      this.$store = store
      
      // build onrender props from storeToProps
      const params = arguments[0] || {}
      const props  = {
        ...(params.props || {}),
        dispatch: store.dispatch,
        ...storeToProps(store)
      }

      // set initial this.model from select(state)
      // this lets boundComponent to ignore data property
      const args = {
        ...params, 
        data: select.call(this, store.state),
        props
      }
      Component.call(this, args)
    }
    BoundComponent.prototype = Object.create(Component.prototype)
    BoundComponent.prototype.constructor = BoundComponent

    return BoundComponent
  }

}
