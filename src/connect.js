import { merge } from './utils'

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
        this.update(select.call(this, state))
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

      // call this after this.destroy is created
      this.destroy = merge(unsub, this.destroy)
    }
    BoundComponent.prototype = Object.create(Component.prototype)
    BoundComponent.prototype.constructor = BoundComponent

    return BoundComponent
  }

}
