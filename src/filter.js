import { shallowEqual } from './utils'

/**
 * returns cached value if possible
 * @param {Function} filter A function which filters state
 */
export default function(filter=(_=>_)){
  let cached = {}

  return function(...data){
    if(!cached.data || !shallowEqual(data, cached.data)){
      cached = {data, value: filter(...data)}
    }
    return cached.value
  }
}
