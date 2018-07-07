import { monkeypatch } from './utils'

const unmounted = function(el){
  while(el.parentNode)
    el = el.parentNode
  return el !== document
}

/**
 * Connects Component and store. Every state changes propagate to component instance.
 * Ignores component's data property. Initial component.model is select(store.state)
 *
 * @param {Function} select A function which transform state to this.model
 * @param {Function} storeToProps A function which returns props of onrender
 * ({state, dispatch}) => {}
 */
export default function({
  select,
  storeToProps=(_=>{})
}={}){

  select = select || function(){ return this.model }

  return function(Component, store){

    const BoundComponent = function(){

      const unsub = store.subscribe((state) => {
        if(unmounted(this.el)){
          unsub()
        } else {
          this.update(select.call(this, state))
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
