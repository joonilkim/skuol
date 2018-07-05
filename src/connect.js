import { merge } from './utils'

/**
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
      
      Component.apply(this, arguments)

      // call this after this.destroy is created
      this.destroy = merge(unsub, this.destroy)
    }
    BoundComponent.prototype = Object.create(Component.prototype)
    BoundComponent.prototype.constructor = BoundComponent

    return BoundComponent
  }

}
