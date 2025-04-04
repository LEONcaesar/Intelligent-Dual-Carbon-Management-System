import request from '@/utils/request'

export function listProduction (query){
    return request({
        url:'mes/production/list',
        method:'get',
        params:query
    })
}


export function getProduction (id){
    return request({
        url:'mes/production/' + id,
        method:'get'
    })
}