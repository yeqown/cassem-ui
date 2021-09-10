import { CLUSTER } from './api'
import { request, METHOD } from '@/utils/request'

export async function getAgents() {
    return request(`${CLUSTER}/agents`, METHOD.GET)
}
