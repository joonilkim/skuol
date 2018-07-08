/*
 * A function which keeps state and returns cached one if state is same.
 * Because store returns copy of state, if no further mutations, this allows 
 * to avoid recalculation.
 *
 * @param {Function} filter A function which filters state
 */
export default function(filter=(_=>_)){
  let cached = {}

  return function(state){
    if(!cached.state || state !== cached.state)
      cached = {state, value: filter(state)}

    return cached.value
  }
}
