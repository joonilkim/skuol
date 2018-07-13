import { assertType } from './asserts'

export function Plugged(){}

export function install(pluggable){
  assertType(pluggable, 'object')
  assertType(pluggable.install, 'function')

  const props = pluggable.install()
  Object.keys(props).forEach(name =>
    Object.defineProperty(
        Plugged.prototype, 
        name, 
        { value: props[name], configurable: true }
    )
  )

  return function(){
    Object.getOwnPropertyNames(props).forEach(name =>
      delete Plugged.prototype[name]
    )
  }
}
