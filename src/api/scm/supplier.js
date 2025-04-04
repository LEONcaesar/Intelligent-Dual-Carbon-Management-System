import request from "@/utils/request"

export function listSupplier(query){
    return request({
        url:'/scm/supplier/list',
        method:'get',
        params: query
    })
}
export function getSupplier(id){
    return request({
        url:'/scm/supplier/' + id,
        method:'get',
    })
}
export function addSupplier(data){
    return request({
        url:'/scm/supplier',
        method:'post',
        data:data
    })
}
export function updateSupplier(data){
    return request({
        url:'/scm/supplier',
        method:'put',
        data:data
    })
}
export function delSupplier(id){
    return request({
        url:'/scm/supplier/' + id,
        method:'delete',
    })
}
export function approveSupplier(data){
    return request({
        url:'/scm/supplier/approve',
        method:'put',
        data:data
    })
}
