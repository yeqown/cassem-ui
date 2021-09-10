import { CLUSTER } from './api'
import { request, METHOD } from '@/utils/request'

export async function getAgents() {
    return request(`${CLUSTER}/agents`, METHOD.GET)
}

export async function getInstances({ limit = 10, seek }) {
    return request(`${CLUSTER}/instances`, METHOD.GET, { limit, seek })
}