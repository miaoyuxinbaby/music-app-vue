import Vue from 'vue'
import Router from 'vue-router'
// Code Splitting
const Recommend = (resolve) => {
  import('@/components/recommend/recommend')
    .then((res) => {
      resolve(res)
    })
}
const Singer = (resolve) => {
  import('@/components/Singer/Singer')
    .then((res) => {
      resolve(res)
    })
}
const Rank = (resolve) => {
  import('@/components/rank/rank')
    .then((res) => {
      resolve(res)
    })
}
const Search = (resolve) => {
  import('@/components/search/search')
    .then((res) => {
      resolve(res)
    })
}
const SingerDetail = (resolve) => {
  import('@/components/singer-detail/singer-detail')
    .then((res) => {
      resolve(res)
    })
}
const Disc = (resolve) => {
  import('@/components/disc/disc')
    .then((res) => {
      resolve(res)
    })
}
const TopList = (resolve) => {
  import('@/components/top-list/top-list')
    .then((res) => {
      resolve(res)
    })
}
const UserCenter = (resolve) => {
  import('@/components/user-center/user-center')
    .then((res) => {
      resolve(res)
    })
}

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/user',
      component: UserCenter
    }
  ]
})
