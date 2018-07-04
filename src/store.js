import { nextTick, deepClone } from './utils'

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

  this._subs = []

  this.subscribe = (fn) => { 
    if(typeof fn !== 'function'){
      console.error(`invalid subscriber: ${fn}`)
      return
    }

    const subs = this._subs

    if(subs.indexOf(fn) < 0) subs.push(fn) 
    return () => {
      const i = subs.indexOf(fn)
      if(i >= 0) subs.splice(i, 1)
    }
  }

  Object.defineProperties(this, {
    state: {
      get(){ 
        if(process.env.NODE_ENV === 'production') return state 

        // 외부에서 state 변경 막음
        // 성능을 위해 production에서는 사용하지 않음
        return Object.freeze(deepClone(state))
      }
    }
  })

  const self = this
  this.dispatch = function(name, val){
    if(name in actions) {
      actions[name].call(this, this, val)
    } else if( name in mutations) {
      self.commit.call(this, name, val)
    } else {
      console.error(`${name} is not defined in actions or mutations`)
    }
  }

  this.commit = function(name, val){
    if(name in mutations){
      mutations[name].call(this, state, val)
    } else {
      console.error(`${name} is not defined in mutations`)
    }

    notifyToSubscribers()
  }

  let scheduled = null

  const notifyToSubscribers = () => {
    if(scheduled) return

    scheduled = nextTick(() => {
      scheduled = null
      const frozenState = this.state
      this._subs.forEach(sub => sub(frozenState))
    })
  }

}

