import PageRouter from './components/PageRouter.vue'
const config = require('./config/index.js')
var map = {
  mode: 'hash',
  base: '/' + config.ADMIN_NAME,
  routes: [
    {
      path: '/:name/:name1/:name2/:name3/:name4/name5',
      component: PageRouter
    },
    {
      path: '/:name/:name1/:name2/:name3/:name4',
      component: PageRouter
    },
    {
      path: '/:name/:name1/:name2/:name3',
      component: PageRouter
    },
    {
      path: '/:name/:name1/:name2',
      component: PageRouter
    },
    {
      path: '/:name/:name1',
      component: PageRouter
    },
    {
      path: '/:name',
      component: PageRouter
    },
    {
      path: '/',
      redirect: '/home'
    }
  ]
}
export default map
