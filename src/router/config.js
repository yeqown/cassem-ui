import TabsView from '@/layouts/tabs/TabsView'
// import BlankView from '@/layouts/BlankView'
import PageView from '@/layouts/PageView'

// 路由配置
const options = {
  routes: [
    {
      path: '/login',
      name: '登录页',
      component: () => import('@/pages/login')
    },
    {
      path: '*',
      name: '404',
      component: () => import('@/pages/exception/404'),
    },
    {
      path: '/403',
      name: '403',
      component: () => import('@/pages/exception/403'),
    },
    {
      path: '/',
      name: '首页',
      component: TabsView,
      redirect: '/login',
      children: [
        {
          path: 'dashboard',
          name: '工作台',
          meta: {
            icon: 'dashboard',
            closable: false
          },
          component: () => import('@/pages/dashboard/workplace'),
        },
        {
          path: 'application',
          name: '应用',
          meta: {
            icon: 'link',
            cacheAble: true
          },
          component: PageView,
          children: [
            {
              path: 'new',
              name: '新建应用',
              meta: {
                icon: 'plus',
              },
              component: () => import('@/pages/app/new'),
            },
            {
              path: 'list',
              name: '应用列表',
              meta: {
                icon: 'more',
              },
              component: () => import('@/pages/app/List'),
            },
          ]
        },
        {
          path: 'cluster',
          name: '集群',
          meta: {
            icon: 'table',
            // authority: 'cluster',
          },
          component: PageView,
          children: [
            {
              path: 'agents',
              name: '客户端代理服务',
              component: () => import('@/pages/list/QueryList'),
            },
            {
              path: 'instances',
              name: '客户端实例',
              component: () => import('@/pages/list/StandardList'),
            }
          ]
        }
      ]
    },
  ]
}

export default options
