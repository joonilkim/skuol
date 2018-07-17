import { assertType } from './asserts'

export function Plugged(){}

Plugged.prototype.props = {}

export function install(plugin){
  assertType(plugin, 'object')
  assertType(plugin.install, 'function')

  plugin.install(Plugged)
}
