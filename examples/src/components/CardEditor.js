import Skuol from 'skuol'

export default Skuol.createComponent({
  className: '_modal-container',
  oncreate({ dispatch }){
    document.body.style.overflow = 'hidden'

    const destroy = this.destroy
    this.destroy = () => {
      document.body.style.overflow = null
      destroy.call(this)
    }

    this.el.innerHTML = `
      <div class='editor-content _modal'>
        <form id='editor-form'>
          <h2>New Issue</h2>
          <section>
            <p class='_oh'>
              <label for='editor-title'>Title<abbr>*</abbr></label>
              <input id='editor-title' class='_fr' required>
            </p>
            <p class='_oh'>
              <label for='editor-desc'>Description</label>
              <textarea id='editor-desc' class='_fr'
                rows='5'></textarea>
            </p>
            <p class='_oh'>
              <label for='editor-assignee'>Assignee<abbr>*</abbr></label>
              <input id='editor-assignee' class='_fr' required>
            </p>
          </section>
          <p>
            <button id='editor-ok' type='submit'>Ok</button>
            <button id='editor-cancel'>Cancel</button>
          </p>
        </form>
      </div>
    `

    const ondestroy = (e) => {
      e.preventDefault()  // to prevent form warnings
      this.destroy()
    }

    this.el.querySelector('.editor-content').onclick = (e) => e.stopPropagation()

    this.el.onclick = ondestroy

    this.el.querySelector('#editor-cancel').onclick = ondestroy

    this.el.querySelector('#editor-form').onsubmit = (e) => {
      e.preventDefault()

      const card = {
        title: this.el.querySelector('#editor-title').value,
        description: this.el.querySelector('#editor-desc').value,
        assignee: this.el.querySelector('#editor-assignee').value
      }
      dispatch('addTodo', card)

      this.destroy()
    }

  }
})
