import { 
  isObject,
  debug,
  monkeypatch,
  nextTick,
  copy,
  deepFreeze
} from './utils'
import { DEBUG } from './globals'
import { assertType, assertArray } from './asserts'


/**
 * @param {Object} state
 * @param {Object} actions An Object to define async functions: 
 * { ({state, commit, dispatch}) => {} }
 * @param {Object} commits
 */
export default function({
  state={},
  actions={},
  commits={}
}={}){

  assertType(state, 'object')

  state = deepFreeze(state)
  this._subs = []

  this.subscribe = (fn) => { 
    assertType(fn, 'function')

    if(this._subs.indexOf(fn) < 0) this._subs.push(fn) 
    return () => {
      const i = this._subs.indexOf(fn)
      if(i >= 0) this._subs.splice(i, 1)
    }
  }

  let stateCache = null

  Object.defineProperties(this, {
    state: {
      get(){ 
        return DEBUG ? Object.freeze(state) : state
      }
    }
  })

  this.dispatch = function(...args){
    const name = args[0]

    if(name in actions) {
      const context = { state, dispatch, commit }
      actions[name].apply(null, [context, ...args.slice(1)])
    } else if(name in commits) {
      commit.apply(null, args)
    } else {
      throw new Error(`actions[${name}] or commits[${name}] is not defined`)
    }
  }
  
  const commit = function(...args) {
    const name = args[0]

    if(!(name in commits))
      throw new Error(`commits[${name}] is not defined`)

    state = copy(state)
    commits[name].apply(null, [state, ...args.slice(1)])

    debug(`committed ${name}`, state)

    notify()
  }

  const notify = () => {
    this._subs.forEach(sub => sub(this.state))
  }

}

