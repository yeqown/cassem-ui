import { LOGIN } from '@/services/api'
import { request, METHOD, removeAuthorization } from '@/utils/request'

/**
 * 登录服务
 * @param name 账户名
 * @param password 账户密码
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function login(name, password) {
  return request(LOGIN, METHOD.POST, {
    account: name,
    password: password
  })
}

export function getRoutesConfig() {
  return [{
    router: 'root',
    children: [
      {
        router: 'dashboard',
      },
      {
        router: 'application',
      },
      {
        router: 'project',
      },
      {
        router: 'cluster',
        name: '集群',
        children: ['agents', 'instances']
      }
    ]
  }]
}

/**
 * 退出登录
 */
export function logout() {
  localStorage.removeItem(process.env.VUE_APP_ROUTES_KEY)
  localStorage.removeItem(process.env.VUE_APP_PERMISSIONS_KEY)
  localStorage.removeItem(process.env.VUE_APP_ROLES_KEY)
  removeAuthorization()
}
export default {
  login,
  logout,
  getRoutesConfig
}
