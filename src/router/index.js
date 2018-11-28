import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import Profile from '@/components/User/Profile'
import Signup from '@/components/User/Signup'
import Login from '@/components/User/Login'
import Logout from '@/components/User/Logout'
import Ask_board from '@/components/board/Ask_board'
import Notice_board from '@/components/board/Notice_board'

Vue.use(Router)

function loggedUserRedirct(to, from , next) {
  if (localStorage.token) {
    next('/profile')
  } else {
    next()
  }
}

function nonLoggedUserRedirect(to, from , next) {
  if (localStorage.token) {
    next()
  } else {
    next('/login')
  }
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      beforeEnter: nonLoggedUserRedirect
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup,
      beforeEnter: loggedUserRedirct
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      beforeEnter: loggedUserRedirct
    },
    {
      path: '/logout',
      name: 'Logout',
      component: Logout,
    },
    {
      path: '/ask',
      name: 'Ask_board',
      component: Ask_board
    },
    {
      path: '/notice',
      name: 'Notice_board',
      component: Notice_board
    }
  ],
  mode: 'history'
})
