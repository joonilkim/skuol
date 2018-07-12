import { DEBUG } from './globals'

export function isObject(o){
  return o != null && typeof o === 'object'
}

export function shallowEqual(o1, o2){
  if(!isObject(o1) || !isObject(o2))
    return o1 === o2

  const [k1, k2] = [Object.keys(o1), Object.keys(o2)]
  return k1.length === k2.length &&
    k1.findIndex(k => o1[k] !== o2[k]) < 0
}

export function warning(...msg){
  if(!DEBUG) return
  if(console.warn) console.warn(...msg)
  else console.log(...msg)
}

export function debug(...msg){
  if(!DEBUG) return
  if(console.debug) console.debug(...msg)
  else console.log(...msg)
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

export function findIndexFrom(nodes, node, fromIdx=0){
  for(let i=fromIdx; i<nodes.length; i++)
    if(nodes[i] === node) return i
  return -1
}



