import { assertType } from './asserts'

export function Pluggable(){}

Pluggable.prototype._plugins = []

export function install(plugin){
  assertType(plugin, 'object')
  assertType(plugin.install, 'function')

  const plugins = Pluggable.prototype._plugins

  plugins.push(plugin.install)

  return () => {
    const i = plugins.indexOf(plugin.install)
    if(i >= 0) plugins.splice(i, 1)
  }

}
