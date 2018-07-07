import { nextTick, deepClone } from './utils'

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
  filter=(_=>_)
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
        if(isStateDirty) {
          stateCache = filter(state)
          isStateDirty = false
        }
        return stateCache
      }
    }
  })

  this.dispatch = function(name, val){
    if(name in actions) {
      actions[name].call(this, { commit }, val)
    } else if(name in mutations) {
      commit.call(this, name, val)
    } else {
      console.error(`${name} is not defined in actions or mutations`)
    }
  }

  const commit = (name, val) => {
    if(name in mutations){
      mutations[name].call(this, state, val)
    } else {
      console.error(`${name} is not defined in mutations`)
    }

    isStateDirty = true
    notifyToSubscribers()
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

