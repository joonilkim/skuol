import Skuol from 'skuol'
import TodoList from './TodoList'
import InProgressList from './InProgressList'
import DoneList from './DoneList'
import CardEditor from './CardEditor'
import Filter from './Filter'


export default Skuol.createComponent({
  oncreate(){
    this.el.innerHTML = `
      <aside>
        <fieldset id='app-filter'>
          <legend>Filter</legend>
        </fieldset>
      </aside>

      <main>
        <p><button id='app-create-issue'>Create Issue</button></p>

        <section class='app-lists'>
          <fieldset id='app-todo'>
            <legend>To Do</legend>
          </fieldset>
          <fieldset id='app-inprogress'>
            <legend>In Progress</legend>
          </fieldset>
          <fieldset id='app-done'>
            <legend>Done</legend>
          </fieldset>
        </section>
      </main>
    `

    this.el.querySelector('#app-filter').appendChild(new Filter().el)

    this.el.querySelector('#app-todo').appendChild(new TodoList().el)
    this.el.querySelector('#app-inprogress').appendChild(new InProgressList().el)
    this.el.querySelector('#app-done').appendChild(new DoneList().el)

    this.el.querySelector('#app-create-issue').onclick = () => {
      document.body.appendChild(new CardEditor().el)
    }

  }
})
