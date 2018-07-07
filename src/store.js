import { nextTick, deepClone, shallowClone, deepFreeze } from './utils'

/**
 * @param {Object} state
 * @param {Object} actions
 * @param {Object} mutations
 * @param {Function} filter A post processor which runs before notify
 */
export default function({
  state={},
  actions={},
  mutations={},
  filters=[]
}={}){

  state = Object.seal(state)  // prevents property insert/delete
  this._subs = []

  this.subscribe = (fn) => { 
    if(typeof fn !== 'function'){
      console.error(`invalid subscriber: ${fn}`)
      return
    }

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
        // state를 외부에서 수정할 경우, 강제로 error발생케 하기 위해 freeze
        const copy = process.env.NODE_ENV === 'production' ? 
            shallowClone : deepFreeze(deepClone)

        if(isStateDirty) {
          stateCache = filters.reduce(
            (s, fn) => fn(s), copy(state))
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
      console.error(`${name} is not defined in actions or mutations`)
    }
  }

  const commit = function(...args){
    const name = args[0]

    if(name in mutations){
      mutations[name].apply(this, [state, ...args.slice(1)])
    } else {
      console.error(`${name} is not defined in mutations`)
    }

    isStateDirty = true
    notifyToSubscribers()

    if(process.env.NODE_ENV !== 'production')
      console.debug('state', state)
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

