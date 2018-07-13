
/*
 * A wrapper class to prevent reflow when accessing children.
 */
export default function(el){
  const children = [...el.children]
  const indexes = {}
  children.forEach(el => indexes[el._id] = el)

  const remove = function(idx){
    delete indexes[children[idx]._id]
    children.splice(idx, 1)
  }

  const insertAt = function(node, idx){
    indexes[node._id] = node
    children.splice(idx, 0, node)
  }

  const findIndex = function(node, fromIdx=0){
    if(!indexes[node._id]) return -1
    for(let i=fromIdx; i<children.length; i++)
      if(children[i] === node) return i
    return -1
  }

  const swap = function(i, j){
    const tmp = children[i]
    children[i] = children[j]
    children[j] = tmp
  }

  this._appendChild = function(node){
    el.appendChild(node)
    children.push(node)
    indexes[node._id] = node
  }

  this.appendChild = function(node){
    const idx = findIndex(node)
    if(idx >= 0) remove(idx, 1)
    this._appendChild(node)
  }

  this.insertBefore = function(node, refIdx){
    el.insertBefore(node, children[refIdx])

    const idx = findIndex(node, refIdx)
    if(idx >= 0) remove(idx)
    insertAt(node, refIdx)
  }

  this.replaceChild = function(node, refIdx){
    el.replaceChild(node, children[refIdx])

    const idx = findIndex(node, refIdx)
    if(idx >= 0) remove(idx)
    children[refIdx] = node
    indexes[node._id] = node
  }

  this.removeChild = function(node, refIdx){
    el.removeChild(node)

    const idx = findIndex(node, refIdx)
    if(idx >= 0) remove(idx)
  }

  this.swapChild = function(node, refIdx){
    const idx = findIndex(node, refIdx)
    if(idx >= 0){
      el.insertBefore(node, children[refIdx])

      if(children[idx+1]) 
        el.insertBefore(children[refIdx], children[idx + 1])
      else 
        el.appendChild(children[refIdx])
      swap(idx, refIdx)
    } else {
      el.insertBefore(node, children[refIdx])
      insertAt(node, refIdx)
    }
  }

  this.removeLast = function(){
    const node = children.pop()
    el.removeChild(node)
    delete indexes[node._id]
  }

  this.hasChild = function(node){
    return node._id in indexes
  }

  Object.defineProperties(this, {
    lastChild: {
      get(){ 
        const size = children.length
        return size ? children[size - 1] : null
      }
    },
    children: {
      get() {
        return children
      }
    }
  })

}


