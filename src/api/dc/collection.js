import request from '@/utils/request'

export function listCollection(query) {
    return request({
        url:'/carbonReport/devicePowerDetails/list',
        method:'get',
        params:query
    })
}