import { 
  monkeypatch,
  nextTick, 
  deepClone, 
  shallowClone, 
  deepFreeze
} from './utils'


// state를 외부에서 수정할 경우, 강제로 error발생케 하기 위해 freeze
const copy = process.env.NODE_ENV === 'production' ? 
    ( (o) => Object.freeze(shallowClone(o)) ) :
    ( (o) => deepFreeze(deepClone(o)) )


/**
 * @param {Object} state
 * @param {Object} actions
 * @param {Object} mutations
 */
export default function({
  state={},
  actions={},
  mutations={}
}={}){

  state = Object.seal(state)  // prevents property insert/delete
  this._subs = []

  this.subscribe = (fn) => { 
    if(typeof fn !== 'function')
      throw new Error(`expected a function, but got ${typeof fn}`)

    if(this._subs.indexOf(fn) < 0) this._subs.push(fn) 
    return () => {
      const i = this._subs.indexOf(fn)
      if(i >= 0) this._subs.splice(i, 1)
    }
  }

  let stateCache = null
  let isStateDirty = true

  Object.defineProperties(this, {
    state: {
      get(){ 
        if(isStateDirty) {
          stateCache = copy(state)
          isStateDirty = false
        }
        return stateCache
      }
    }
  })

  this.dispatch = function(...args){
    const name = args[0]

    if(name in actions) {
      actions[name].apply(this, [{ commit }, ...args.slice(1)])
    } else if(name in mutations) {
      commit.apply(this, args)
    } else {
      throw new Error(`actions[${name}] or mutations[${name}] is not defined`)
    }
  }

  const commit = function(...args){
    const name = args[0]

    if(name in mutations){
      mutations[name].apply(this, [state, ...args.slice(1)])
    } else {
      throw new Error(`mutations[${name}] is not defined`)
    }

    isStateDirty = true
    notifyToSubscribers()

    if(process.env.NODE_ENV === 'development')
      console.debug(`committed ${name}`, state)
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

