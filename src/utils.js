export const env = process ? process.env.NODE_ENV : 'production'

export function empty(el){
  while(el.firstChild) el.removeChild(el.firstChild)
}

export function shallowEqual(o1, o2){
  if(o1 == null || o2 == null ||
      typeof o1 !== 'object' || typeof o2 !== 'object')
    return o1 === o2

  const [k1, k2] = [Object.keys(o1), Object.keys(o2)]
  return k1.length === k2.length &&
    k1.findIndex(k => o1[k] !== o2[k]) < 0
}

export function warning(...msg){
  if(env === 'production') return
  if(console.warn) console.warn(...msg)
}

export function debug(...msg){
  if(env === 'production') return
  if(console.debug) console.debug(...msg)
}

export function nextTick(fn){
  setTimeout.call(this, fn, 0)
}

export function deepCopy(obj){
  return JSON.parse(JSON.stringify(obj));
}

export function copy(o){
  if(typeof o !== 'object') return o
  return Array.isArray(o) ? [...o] : {...o}
}

export function deepFreeze(o){
  Object.freeze(o)
  Object.keys(o).forEach(k => {
    if(typeof o[k] === 'object') deepFreeze(o[k])
  })
  return o
}

export function deepSeal(o){
  Object.seal(o)
  Object.keys(o).forEach(k => {
    if(typeof o[k] === 'object') deepSeal(o[k])
  })
  return o
}

export function monkeypatch(...fns){
  return function(){
    fns
      .filter(fn => !!fn)
      .forEach(fn => fn.apply(this, arguments))
  }
}

/**
 * object version of Array.filter
 * @param {Object|Array} obj
 */
export function filterObject(obj, fn){
  if(Array.isArray(obj)){
    return obj.filter(fn)
  } else {
    return Object.keys(obj)
      .filter(fn)
      .reduce((o, k) => (
        {...o, [k]: obj[k]}
      ), {})
  }
}

