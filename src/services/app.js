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

export async function deleteApp(appId) {
  return request(`${APPS}/${appId}`, METHOD.DELETE)
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

export async function createAppEnvElement({ appId, env, key, contentType, value }) {
  return request(`${APPS}/${appId}/envs/${env}/elements/${key}`, METHOD.POST, {
    contentType, raw: value,
  })
}

export async function updateAppEnvElement({ appId, env, key, value }) {
  return request(`${APPS}/${appId}/envs/${env}/elements/${key}`, METHOD.PUT, {
    raw: value,
  })
}

export async function getAppEnvElement({ appId, env, key }) {
  return request(`${APPS}/${appId}/envs/${env}/elements/${key}`, METHOD.GET)
}


export async function deleteAppEnvElement({ appId, env, key, }) {
  return request(`${APPS}/${appId}/envs/${env}/elements/${key}`, METHOD.DELETE)
}

export async function getAppElements({ appId, env, seek, limit }) {
  return request(`${APPS}/${appId}/envs/${env}/elements`, METHOD.GET, { seek, limit })
}

export async function deleteAppEnv({ appId, env }) {
  return request(`${APPS}/${appId}/envs/${env}`, METHOD.DELETE)
}


export const PUBLISH_MODE_GRAY = 1
export const PUBLISH_MODE_ALL = 2

export async function publishAppEnvElement({ appId, env, key, version, mode = PUBLISH_MODE_GRAY }) {
  return request(`${APPS}/${appId}/envs/${env}/elements/${key}/publish`, METHOD.POST, {
    version: version,
    publishMode: mode,
  })
}

export default {
  getApps,
  createApp,
  getApp,
  getAppEnvs,
  createAppEnv,
  getAppElements,
  deleteAppEnv,

  PUBLISH_MODE_ALL,
  PUBLISH_MODE_GRAY
}
