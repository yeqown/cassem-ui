// 视图组件
const view = {
  tabs: () => import('@/layouts/tabs'),
  blank: () => import('@/layouts/BlankView'),
  page: () => import('@/layouts/PageView')
}

// 路由组件注册
const routerMap = {
  login: {
    authority: '*',
    path: '/login',
    component: () => import('@/pages/login')
  },
  root: {
    path: '/',
    name: '首页',
    redirect: '/login',
    component: view.tabs
  },
  dashboard: {
    name: '工作台',
    path: '/dashboard',
    component: () => import('@/pages/dashboard/workplace')
  },
  application: {
    name: '应用',
    path: '/application',
    component: () => import('@/pages/app/List')
  },
  applicationDetail: {
    name: '应用详情',
    path: 'detail',
    component: () => import('@/pages/app/detail/Detail')
  },
  form: {
    name: '表单页',
    icon: 'form',
    component: view.page
  },
  createApp: {
    path: 'new',
    name: '新建应用',
    component: () => import('@/pages/app/new')
  },
  // stepForm: {
  //   path: 'step',
  //   name: '分步表单',
  //   component: () => import('@/pages/form/step')
  // },
  // advanceForm: {
  //   path: 'advance',
  //   name: '高级表单',
  //   component: () => import('@/pages/form/advance')
  // },
  // list: {
  //   name: '列表页',
  //   icon: 'table',
  //   component: view.page
  // },
  // queryList: {
  //   path: 'query',
  //   name: '查询表格',
  //   component: () => import('@/pages/list/QueryList')
  // },
  // primaryList: {
  //   path: 'primary',
  //   name: '标准列表',
  //   component: () => import('@/pages/list/StandardList')
  // },
  // cardList: {
  //   path: 'card',
  //   name: '卡片列表',
  //   component: () => import('@/pages/list/CardList')
  // },
  // result: {
  //   name: '结果页',
  //   icon: 'check-circle-o',
  //   component: view.page
  // },
  success: {
    name: '成功',
    component: () => import('@/pages/result/Success')
  },
  error: {
    name: '失败',
    component: () => import('@/pages/result/Error')
  },
  exception: {
    name: '异常页',
    icon: 'warning',
    component: view.blank
  },
  exp403: {
    authority: '*',
    name: 'exp403',
    path: '403',
    component: () => import('@/pages/exception/403')
  },
  exp404: {
    name: 'exp404',
    path: '404',
    component: () => import('@/pages/exception/404')
  },
  exp500: {
    name: 'exp500',
    path: '500',
    component: () => import('@/pages/exception/500')
  }
}
export default routerMap

