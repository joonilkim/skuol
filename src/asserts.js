export function assert(expr, msg){
  if(!expr)
    throw new Error(o)
}

export function assertArray(obj){
  if(!Array.isArray(obj))
    throw new Error(`expected Array, but got ${typeof obj}`)
}

export function assertType(obj, type){
  const _type = obj == null ? 'null' : typeof obj 
  if(_type !== type)
    throw new Error(`expected ${type}, but got ${typeof obj}`)
}
