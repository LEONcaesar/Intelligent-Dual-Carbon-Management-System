import request from "@/utils/request.js";

/**
 * 查询智能仓储WMS-补货申请详细
 * @param id
 * @returns {*}
 */
export function getReplenishmentApplication(id) {
    return request({
        url: '/wms/replenishmentApplication/' + id,
        method: 'get'
    })
}

/**
 * 查询用户列表
 * @returns {*}
 */
export function listUser() {
    return request({
        url: 'system/user/userList',
        method: 'get',
    })
}

/**
 * 查询物料列表不分页
 * @returns {*}
 */
export function listMaterial() {
    return request({
        url: '/wms/material/materialList',
        method: 'get',
    })
}

/**
 * 审核智能仓储WMS-补货申请
 * @param data
 * @returns {*}
 */
export function approveReplenishmentApplication(data) {
    return request({
        url: '/wms/replenishmentApplication/approve',
        method: 'put',
        data: data
    })
}

/**
 * 查询智能仓储WMS-补货申请列表
 * @param query
 * @returns {*}
 */
export function listReplenishmentApplication(query) {
    return request({
        url: '/wms/replenishmentApplication/list',
        method: 'get',
        params: query
    })
}