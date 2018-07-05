export function empty(el){
  while(el.firstChild) el.removeChild(el.firstChild)
}

export function shallowEqual(o1, o2){
  if(typeof o1 !== 'object' || typeof o2 !== 'object')
    return o1 === o2

  const [k1, k2] = [Object.keys(o1), Object.keys(o2)]
  return k1.length === k2.length &&
    k1.findIndex(k => o1[k] !== o2[k]) < 0
}

export function assert(expr, errorMessage){
  if(!expr) throw new Error(errorMessage)
}

export function nextTick(fn){
  setTimeout.call(this, fn, 0)
}

export function deepClone(obj){
  return JSON.parse(JSON.stringify(obj));
}

export function merge(...fns){
  return function(){
    fns
      .filter(fn => !!fn)
      .forEach(fn => fn.apply(this, arguments))
  }
}


