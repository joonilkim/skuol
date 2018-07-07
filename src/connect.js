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
 * @param {Function} select A function which transform state to props
 */
export default function({
  select 
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
      
      // set initial this.model from select(state)
      // this lets boundComponent to ignore data property
      const args = {
        ...(arguments[0] || {}), 
        data: select.call(this, store.state) 
      }
      Component.call(this, args)
    }
    BoundComponent.prototype = Object.create(Component.prototype)
    BoundComponent.prototype.constructor = BoundComponent

    return BoundComponent
  }

}
