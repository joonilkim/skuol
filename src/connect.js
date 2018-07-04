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

      this.$store = store

      this.ondestroy = merge(unsub, this.ondestroy)

      Component.apply(this, arguments)
    }
    BoundComponent.prototype = Object.create(Component.prototype)
    BoundComponent.prototype.constructor = BoundComponent

    return BoundComponent
  }

}
