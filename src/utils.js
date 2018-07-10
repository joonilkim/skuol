export const env = process ? process.env.NODE_ENV : 'production'

export function isObject(o){
  return o != null && typeof o === 'object'
}

export function empty(el){
  while(el.firstChild) el.removeChild(el.firstChild)
}

export function shallowEqual(o1, o2){
  if(!isObject(o1) || !isObject(o2))
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
  if(!isObject(o)) return o
  return Array.isArray(o) ? [...o] : {...o}
}

export function deepFreeze(o){
  if(!isObject(o)) return o

  Object.freeze(o)
  Object.keys(o).forEach(k => {
    deepFreeze(o[k])
  })
  return o
}

export function deepSeal(o){
  if(!isObject(o)) return o

  Object.seal(o)
  Object.keys(o).forEach(k => {
    deepSeal(o[k])
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
  if(!isObject(obj)) return obj

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

