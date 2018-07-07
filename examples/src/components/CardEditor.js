import Skuol from 'skuol'
import store from '../store'

export default Skuol.createComponent({
  className: 'modal-bg',
  oncreate(){
    document.body.style.overflow = 'hidden'

    const destroy = this.destroy
    this.destroy = () => {
      document.body.style.overflow = 'auto'
      destroy.call(this)
    }
  },
  onrender(){
    this.el.innerHTML = `
      <div class='modal-window'>
        <form>
          <h2>New Issue</h2>
          <section>
            <p class='_oh'>
              <label for='editor-title'>Title</label>
              <input id='editor-title' class='_fr'>
            </p>
            <p class='_oh'>
              <label for='editor-desc'>Description</label>
              <textarea id='editor-desc' class='_fr'
                rows='5'></textarea>
            </p>
            <p class='_oh'>
              <label for='editor-assignee'>Assignee</label>
              <input id='editor-assignee' class='_fr'>
            </p>
          </section>
          <p>
            <button id='editor-ok'>Ok</button>
            <button id='editor-cancel'>Cancel</button>
          </p>
        </form>
      </div>
    `

    const destroy = (e) => {
      e.preventDefault()  // to prevent form warnings
      this.destroy()
    }

    this.el.querySelector('.modal-window').onclick = (e) => e.stopPropagation()

    this.el.onclick = destroy

    this.el.querySelector('#editor-cancel').onclick = destroy

    this.el.querySelector('#editor-ok').onclick = (e) => {
      e.preventDefault()  // to prevent form warnings

      store.dispatch('addTodo', {
        title: this.el.querySelector('#editor-title').value,
        description: this.el.querySelector('#editor-desc').value,
        assignee: this.el.querySelector('#editor-assignee').value
      })

      this.destroy()
    }

  }
})
