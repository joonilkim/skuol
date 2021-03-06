export function isObject(o){
  return o != null && typeof o === 'object'
}

export function intersection(a, b){
  return a.filters(x => b.includes(a))
}

const strcmp = function(a, b){
  return a === b ? 0 : (a > b ? 1 : -1)
}

export function shallowEqual(o1, o2){
  if(!isObject(o1) || !isObject(o2))
    return o1 === o2

  const [k1, k2] = [Object.keys(o1), Object.keys(o2)]
  return k1.length === k2.length &&
    k1.findIndex(k => o1[k] !== o2[k]) < 0
}

export function deepEqual(o1, o2){
  if(!isObject(o1) || !isObject(o2))
    return o1 === o2

  const [k1, k2] = [Object.keys(o1), Object.keys(o2)]
  return k1.length === k2.length &&
    k1.findIndex(k => !deepEqual(o1[k], o2[k])) < 0
}

/* not implemented yet */
export function escape(s){ 
  return s
}
