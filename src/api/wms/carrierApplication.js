import request from '@/utils/request'

// 查询智能仓储WMS-运输管理-承运申请列表
export function listCarrierApplication(query) {
  return request({
    url: '/wms/carrierApplication/list',
    method: 'get',
    params: query
  })
}

// 查询智能仓储WMS-运输管理-承运申请详细
export function getCarrierApplication(id) {
  return request({
    url: '/wms/carrierApplication/' + id,
    method: 'get'
  })
}

// 新增智能仓储WMS-运输管理-承运申请
export function addCarrierApplication(data) {
  return request({
    url: '/wms/carrierApplication',
    method: 'post',
    data: data
  })
}

// 修改智能仓储WMS-运输管理-承运申请
export function updateCarrierApplication(data) {
  return request({
    url: '/wms/carrierApplication',
    method: 'put',
    data: data
  })
}
// 审核智能仓储WMS-运输管理-承运申请
export function carrierApplication(data) {
  return request({
    url: '/wms/carrierApplication/approve',
    method: 'put',
    data: data
  })
}
// 提交智能仓储WMS-运输管理-承运申请
export function subCarrierApplication(data) {
  return request({
    url: '/wms/carrierApplication/submit',
    method: 'put',
    data: data
  })
}

// 删除智能仓储WMS-运输管理-承运申请
export function delCarrierApplication(id) {
  return request({
    url: '/wms/carrierApplication/' + id,
    method: 'delete'
  })
}

// 查询客户列表
export function listCustom() {
  return request({
    url: 'scm/custom/customList',
    method: 'get',
  })
}

// 查询用户列表
export function listUser() {
  return request({
    url: 'system/user/userList',
    method: 'get',
  })
}

// 查询物料列表不分页
export function listMaterial() {
  return request({
    url: '/wms/material/materialList',
    method: 'get',
  })
}

// 查询仓库列表不分页
export function listWarehouse() {
  return request({
    url: '/wms/warehouse/warehouseList',
    method: 'get',
  })
}

// 查询仓库详细
export function getWarehouse(id) {
  return request({
    url: '/wms/warehouse/' + id,
    method: 'get'
  })
}

// 查询库区详细
export function getArea(id) {
  return request({
    url: '/wms/area/' + id,
    method: 'get'
  })
}
