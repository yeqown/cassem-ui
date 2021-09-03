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

export async function getApp({ appId }) {
  return request(`${APPS}/${appId}`, METHOD.GET)
}

export async function getAppEnvs({ appId }) {
  return request(`${APPS}/${appId}/envs`, METHOD.GET)
}

export async function createAppEnv({ appId, env }) {
  return request(`${APPS}/${appId}/envs/${env}`, METHOD.POST)
}

export async function getAppElements({ appId, env, seek, limit }) {
  return request(`${APPS}/${appId}/envs/${env}/elements`, METHOD.GET, { seek, limit })
}

export async function deleteAppEnv({ appId, env }) {
  return request(`${APPS}/${appId}/envs/${env}`, METHOD.DELETE)
}


export default {
  getApps,
  createApp,
}
