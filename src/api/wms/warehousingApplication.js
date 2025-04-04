import request from '@/utils/request'

// 查询智能仓储WMS-入库申请列表
export function listWarehousingApplication(query) {
  return request({
    url: '/wms/warehousingApplication/list',
    method: 'get',
    params: query
  })
}

// 查询智能仓储WMS-入库申请详细
export function getWarehousingApplication(id) {
  return request({
    url: '/wms/warehousingApplication/' + id,
    method: 'get'
  })
}

// 新增智能仓储WMS-入库申请
export function addWarehousingApplication(data) {
  return request({
    url: '/wms/warehousingApplication',
    method: 'post',
    data: data
  })
}
// 提交智能仓储WMS-入库申请
export function subWarehousingApplication(data) {
  return request({
    url: '/wms/warehousingApplication/submit',
    method: 'put',
    data: data
  })
}

// 修改智能仓储WMS-入库申请
export function updateWarehousingApplication(data) {
  return request({
    url: '/wms/warehousingApplication',
    method: 'put',
    data: data
  })
}

// 删除智能仓储WMS-入库申请
export function delWarehousingApplication(id) {
  return request({
    url: '/wms/warehousingApplication/' + id,
    method: 'delete'
  })
}

// 查询用户列表
export function listUser() {
  return request({
    url: 'system/user/userList',
    method: 'get',
  })
}

// 查询供应商列表
export function listSupplier() {
  return request({
    url: '/scm/supplier/supplierList',
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

//入库
export function warehousingApplication(data) {
  return request({
    url: '/wms/warehousingApplication/executeWarehousing',
    method: 'post',
    data: data
  })
}

// 入库审核
export function approveWarehousingApplication(data) {
  return request({
    url: '/wms/warehousingApplication/approve',
    method: 'put',
    data: data
  })
}
