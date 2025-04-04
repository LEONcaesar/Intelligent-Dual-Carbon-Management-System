import request from '@/utils/request'

// 查询供应链SCM-销售管理-销售订单列表
export function listOrder(query) {
    return request({
        url: '/scm/order/list',
        method: 'get',
        params: query
    })
}

// 查询客户档案列表(不分页)
export function listCustomList(query) {
    return request({
        url: '/scm/custom/customList',
        method: 'get',
        params: query
    })
}

// 查询供应链SCM-销售管理-销售订单详细
export function getOrder(id) {
    return request({
        url: '/scm/order/' + id,
        method: 'get'
    })
}

// 提交供应链SCM-销售管理-销售订单
export function approveOrder(data) {
    return request({
        url: '/scm/order/approve',
        method: 'put',
        data: data
    })
}