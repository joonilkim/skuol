import Skuol from 'skuol'
import store from './store'
import './assets/utils.scss'
import './assets/app.scss'
import App from './components/App'

Skuol.install(store)

const app = new App()
document.querySelector('body').appendChild(app.el)
