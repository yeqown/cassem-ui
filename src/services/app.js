import { APPS } from '@/services/api'
import { request, METHOD } from '@/utils/request'

/**
 * 登录服务
 * @param seek 定位
 * @param limit 分页
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function getApps(seek, limit) {
  return request(APPS, METHOD.GET, {
    seek: seek,
    limit: limit,
  })
}

export async function createApp({ name, appId, desc }) {
  return request(`${APPS}/${appId}`, METHOD.POST, {
    name: name,
    description: desc,
  })
}

export default {
  getApps,
  createApp,
}
