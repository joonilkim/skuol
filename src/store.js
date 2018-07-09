import { 
  env,
  debug,
  monkeypatch,
  nextTick,
  copy,
  deepFreeze
} from './utils'


// state를 외부에서 수정할 경우, 강제로 error발생케 하기 위해 freeze
const freeze = env === 'production' ? Object.freeze : deepFreeze


/**
 * @param {Object} state
 * @param {Object} actions
 * @param {Object} commits
 */
export default function({
  state={},
  actions={},
  commits={}
}={}){

  if(typeof state !== 'object')
    throw new Error(`expected object, but got ${typeof state}`)

  state = deepFreeze(state)
  this._subs = []

  this.subscribe = (fn) => { 
    if(typeof fn !== 'function')
      throw new Error(`expected function, but got ${typeof fn}`)

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
        return Object.isFrozen(state) ? state: freeze(state)
      }
    }
  })

  this.dispatch = function(...args){
    const name = args[0]

    if(name in actions) {
      actions[name].apply(this, [{ commit }, ...args.slice(1)])
    } else if(name in commits) {
      commit.apply(this, args)
    } else {
      throw new Error(`actions[${name}] or commits[${name}] is not defined`)
    }
  }
  
  const commit = function(...args){
    const name = args[0]

    if(!(name in commits))
      throw new Error(`commits[${name}] is not defined`)

    state = copy(state)
    commits[name].apply(this, [state, ...args.slice(1)])

    notifyToSubscribers()

    debug(`committed ${name}`, state)
  }

  let scheduled = null

  const notifyToSubscribers = () => {
    if(scheduled) return

    scheduled = nextTick(() => {
      scheduled = null
      this._subs.forEach(sub => sub(this.state))
    })
  }

}

